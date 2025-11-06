Public Const csUnindentedBodyText = "Textkörper1"
Public Const csFlowTable = "_Tab"  'bookmark including a table to be positioned
Public Const csFlowAnchor = "_Anc" 'bookmark including the paragraph that first mentions the table
Public Const ciSafeLineWidth = 67


Public Sub RevertFlowTables()
Dim bkmTables() As Bookmark
Dim bkmTargets() As Bookmark

Dim rng As Range
Dim bkm As Bookmark
Dim sBkmName As String, sLinkName As String
Dim iMaxLink As Integer, iLink As Integer
Dim docBuffer As Document
Dim ok As Boolean
Dim I As Integer
Dim answer As Integer
Dim rngJob As Range
    answer = MsgBox("This script restores tables to their old positions next to the anchoring bookmark." & vbCrLf & "Do you want to proceed only from the cursor position onwards (yes)" & vbCrLf & "instead of the whole document (no)?", vbYesNoCancel, "Lukas’ Table Positioning Script")
    If answer = vbCancel Then Exit Sub
    If answer = vbYes Then
        Set rngJob = Selection.Range
        rngJob.MoveEnd wdStory, 1
    Else
        Set rngJob = ActiveDocument.StoryRanges(wdMainTextStory)
    End If
    For Each bkm In rngJob.Bookmarks
        sBkmName = bkm.Name
        If (InStr(sBkmName, csFlowAnchor) = Len(sBkmName) - Len(csFlowAnchor) + 1) And Len(sBkmName) > Len(csFlowAnchor) Then
            sLinkName = Left$(sBkmName, Len(sBkmName) - Len(csFlowAnchor))
            If ActiveDocument.Bookmarks.Exists(sLinkName & csFlowTable) Then
                iMaxLink = iMaxLink + 1
                ReDim Preserve bkmTables(1 To iMaxLink)
                ReDim Preserve bkmTargets(1 To iMaxLink)
                Set bkmTables(iMaxLink) = ActiveDocument.Bookmarks(sLinkName & csFlowTable)
                Set bkmTargets(iMaxLink) = bkm
            End If
        End If
    Next bkm
    
    Set docBuffer = Word.Documents.Add(ActiveDocument.AttachedTemplate.Name)
    'Go backwards; that should save some page break processing time
    For iLink = iMaxLink To 1 Step -1
        sBkmName = bkmTables(iLink).Name
        Set rng = bkmTables(iLink).Range
        rng.Cut
        ok = RepairSplitParagraph(rng)
        Set rng = docBuffer.Range
        rng.Collapse wdCollapseEnd
        rng.InsertBreak wdPageBreak
        rng.Paste
        Set bkmTables(iLink) = rng.Bookmarks(sBkmName)
        If Not ok Then Exit For
    
    Next iLink

    For iLink = iMaxLink To 1 Step -1
        Set rng = bkmTargets(iLink).Range.Paragraphs(1).Range
        rng.Collapse wdCollapseEnd
        If rng.Information(wdWithInTable) Then
            rng.Move wdCharacter, -1
        End If
        sBkmName = bkmTables(iLink).Name
        bkmTables(iLink).Select
        bkmTables(iLink).Range.Copy
        rng.Select
        rng.Paste
        Set bkmTables(iLink) = rng.Bookmarks(sBkmName)
    Next iLink
    If docBuffer.Bookmarks.Count = 0 Then
        docBuffer.Close wdDoNotSaveChanges
    End If

End Sub

Public Sub PositionFlowTables()
Dim bkmTables() As Bookmark
Dim bkmTargets() As Bookmark
Dim fTblHeights() As Single
Dim fPageHeight As Single

Dim par As Paragraph, rng As Range
Dim bkm As Bookmark
Dim sBkmName As String, sLinkName As String
Dim iMaxLink As Integer, iLink As Integer
Dim ok As Boolean, bForcePageBreak As Boolean, bPreferTop As Boolean
Dim answer As Integer
Dim rngJob As Range, rngFit As Range
Dim docBuffer As Document

    'Find all pairs of bookmarks denoting pairs of
    'positioning targets and floating tables.
        
    answer = MsgBox("This script moves bookmarked tables to either the bottom or the top of a page." & vbCrLf & "Do you want to proceed only from the cursor position onwards (yes)" & vbCrLf & "instead of the whole document (no)?", vbYesNoCancel, "Lukas’ Table Positioning Script")
    If answer = vbCancel Then Exit Sub
    If answer = vbYes Then
        Set rngJob = Selection.Range
        rngJob.MoveEnd wdStory, 1
    Else
        Set rngJob = ActiveDocument.StoryRanges(wdMainTextStory)
    End If
    For Each bkm In rngJob.Bookmarks
        sBkmName = bkm.Name
        If (InStr(sBkmName, csFlowAnchor) = Len(sBkmName) - Len(csFlowAnchor) + 1) And Len(sBkmName) > Len(csFlowAnchor) Then
            sLinkName = Left$(sBkmName, Len(sBkmName) - Len(csFlowAnchor))
            If ActiveDocument.Bookmarks.Exists(sLinkName & csFlowTable) Then
                iMaxLink = iMaxLink + 1
                ReDim Preserve bkmTables(1 To iMaxLink)
                ReDim Preserve bkmTargets(1 To iMaxLink)
                ReDim Preserve fTblHeights(1 To iMaxLink)
                Set bkmTables(iMaxLink) = ActiveDocument.Bookmarks(sLinkName & csFlowTable)
                Set bkmTargets(iMaxLink) = bkm
            End If
        End If
    Next bkm
  
    If iMaxLink = 0 Then
        MsgBox "I couldn't find any tables marked to be processed by this script. " & vbCrLf & _
            "Please include each table to be processed in a bookmark" & vbCrLf & _
            "whose name ends in """ & csFlowTable & """, and mark a text" & vbCrLf & _
            "paragraph near which it should occur with a bookmark " & vbCrLf & _
            "ending in """ & csFlowAnchor & """.", vbOKOnly
        Exit Sub
    End If
    
    With bkmTargets(1).Range.PageSetup
        fPageHeight = .PageHeight - .BottomMargin - .TopMargin
    End With
    
    'First cut out all the tables and store them somewhere else.
    Set docBuffer = Word.Documents.Add(ActiveDocument.AttachedTemplate.Name)
    'Put a dummy 1st-level heading into the dummy document,
    'for the table numbering to work
    docBuffer.Paragraphs.Add
    docBuffer.Paragraphs(1).Style = wdStyleHeading1
    
    For iLink = 1 To iMaxLink
        CutAndMeasure bkmTables(iLink), docBuffer, fTblHeights(iLink)
    Next iLink
            
    'Now iterate through the targets and find positions for the tables.
    For iLink = 1 To iMaxLink
        'decide if we can place the table right near the
        'target bookmark, or if another earlier table has floated
        'past it, so we need to place the next one after that.
    
        If fTblHeights(iLink) > 0.6 * fPageHeight Then
            bPreferTop = True
        Else
            bPreferTop = False
        End If
        If iLink < iMaxLink Then
            If bkmTargets(iLink + 1).Range.Information(wdActiveEndPageNumber) _
                = bkmTargets(iLink).Range.Information(wdActiveEndPageNumber) Then
                bPreferTop = True
            End If
        End If
        If iLink > 1 Then
            If bkmTargets(iLink).Range.End > bkmTables(iLink - 1).Range.End Then
                FindPlaceAround bkmTargets(iLink).Range, fTblHeights(iLink), rngFit, bForcePageBreak, bPreferTop
            Else
                FindPlaceAfter bkmTables(iLink - 1).Range, fTblHeights(iLink), rngFit, bForcePageBreak
            End If
        Else
            FindPlaceAround bkmTargets(iLink).Range, fTblHeights(iLink), rngFit, bForcePageBreak, bPreferTop
        End If
        MoveBookmarkedTable bkmTables(iLink), rngFit, bForcePageBreak
        
        Debug.Print iLink & " " & bkmTargets(iLink).Name & "/" & bkmTables(iLink).Name & ": "
                        
    Next iLink
    If docBuffer.Bookmarks.Count = 0 Then
        docBuffer.Close wdDoNotSaveChanges
    End If
End Sub


Private Sub MoveBookmarkedTable(bkm As Bookmark, rng As Range, ByVal bForcePageBreak As Boolean)
Dim sBookmark As String
Dim sty As Style
Dim rng2 As Range
    If rng.Start > rng.Paragraphs(1).Range.Start + 1 Then
        '(Stupid. If the start of the line is one position higher
        'than the start of the paragraph, the paragraph's
        'first character must be a manual page or line break!)
        
        If rng.ParagraphFormat.FirstLineIndent Then
            Set sty = ActiveDocument.Styles(csUnindentedBodyText)
        Else
            Set sty = rng.Paragraphs(1).Style
        End If
        rng.InsertBreak wdLineBreak
        rng.InsertParagraph
        rng.Characters(1).font.Size = 1
        rng.Move wdParagraph, 1
        rng.Paragraphs(1).Style = sty
    End If
    If bForcePageBreak Then
        rng.InsertBreak wdPageBreak
        rng.Move wdCharacter, -1
    End If
    
    sBookmark = bkm.Name
    'bkm.Range.Select
    bkm.Range.Cut
    'rng.Select
    rng.Paste
    Set bkm = rng.Bookmarks(sBookmark)
End Sub


Private Function RepairSplitParagraph(rng As Range) As Boolean
Dim rngShow As Range
Dim sty As Style
Dim answer As Integer

    Set sty = rng.Previous(wdParagraph, 1).Paragraphs(1).Style
    If rng.Characters(1).Text = Chr$(12) Then
        'we can't be sure if this was a page break
        'intentionally place here by the author, or
        'one automatically inserted by the table
        'placement script!
        Set rngShow = rng
        rngShow.MoveEnd wdCharacter, 1
        rngShow.Select
        answer = vbYes
        'answer = MsgBox("Do you want to remove this page break?", vbYesNoCancel, "Lukas’ Table Positioning Script")
        Select Case answer
        Case vbCancel
            RepairSplitParagraph = False
            Exit Function
        Case vbYes
            rng.Characters(1).Delete
        End Select
    End If
    If (rng.Previous(wdCharacter, 1).Text = Chr$(13)) And _
        (rng.Previous(wdCharacter, 2).Text = Chr$(11)) Then
        rng.Previous(wdCharacter, 1).Delete
        rng.Previous(wdCharacter, 1).Delete
        rng.Paragraphs(1).Style = sty
    End If
    RepairSplitParagraph = True
End Function

Private Function WantToGoAWordBack(rng As Range) As Boolean
        'If the break is within a word, or if the preceding
        'line is rather full, move back a word.
        'Another script might have to insert one or two words
        'within the preceding paragraph. In order for the page
        'not to spill over again in that case, we will move the page
        'break one word to the left - even if that means the last
        'line might become rather open.
Do While (rng.Start <> rng.Words(1).Start) Or _
rng.Previous(wdCharacter, 1).Information(wdFirstCharacterColumnNumber) > ciSafeLineWidth
    WantToGoAWordBack = True
    rng.Move wdWord, -1
Loop
End Function


Private Sub FindPlaceAround(ByRef rngStart As Range, ByVal fHeight As Single, ByRef rngFit As Range, ByRef bForcePageBreak As Boolean, ByVal bPreferTop As Boolean)
    bForcePageBreak = False
    If bPreferTop Then
        If FitOnTop(rngStart, fHeight, rngFit) = False Then
            FitOnNextPage rngStart, fHeight, rngFit
        End If
    Else
        If FitOnBottom(rngStart, fHeight, rngFit, bForcePageBreak) = False Then
            bForcePageBreak = False
            FitOnNextPage rngStart, fHeight, rngFit
        End If
    End If
End Sub

Private Sub FindPlaceAfter(ByRef rngStart As Range, ByVal fHeight As Single, ByRef rngFit As Range, ByRef bForcePageBreak As Boolean)
    bForcePageBreak = False
    If FitOnBottom(rngStart, fHeight, rngFit, bForcePageBreak) = False Then
        bForcePageBreak = False
        FitOnNextPage rngStart, fHeight, rngFit
    End If
End Sub

Private Function FitOnTop(ByRef rngStart As Range, ByVal fHeight As Single, ByRef rngFit As Range) As Boolean
Dim fYPosStart As Single
Dim rng As Range
Dim ok As Boolean

    Set rng = rngStart
    rng.Collapse wdCollapseStart
    fYPosStart = rng.Information(wdVerticalPositionRelativeToPage)
    With rng.PageSetup
        If fYPosStart + fHeight < .PageHeight - .BottomMargin Then
            ok = True
        End If
    End With
    If ok Then
        If rng.Information(wdActiveEndPageNumber) > 1 Then
        'Stupid. Why isn't it easier to move simply
        'to the top of the same page??
            Set rng = rng.GoToPrevious(wdGoToPage)
            Set rng = rng.GoToNext(wdGoToPage)
        Else
            rng.Move wdStory, -1
        End If
        If rng.Information(wdWithInTable) Then
            FitOnTop = False
            Exit Function
        End If
        WantToGoAWordBack rng
        Set rngFit = rng
        FitOnTop = True
    End If
End Function

Private Function FitOnNextPage(ByRef rngStart As Range, ByVal fHeight As Single, ByRef rngFit As Range) As Boolean
Dim rng As Range
Dim ok As Boolean

    Set rng = rngStart
    rng.Collapse wdCollapseEnd
    Do
        If rng.Information(wdActiveEndPageNumber) < rng.Information(wdNumberOfPagesInDocument) Then
            Set rng = rng.GoToNext(wdGoToPage)
        Else
            rng.EndOf wdStory, wdMove
            rng.InsertBreak wdPageBreak
            rng.Collapse wdCollapseEnd
        End If
    Loop Until Not (rng.Information(wdWithInTable))
    WantToGoAWordBack rng
    FitOnNextPage = True
    Set rngFit = rng
End Function




Private Function FitOnBottom(ByRef rngStart As Range, ByVal fHeight As Single, ByRef rngFit As Range, ByRef bForcePageBreak As Boolean) As Boolean
Dim iPg As Long, iPg1 As Long
Dim fYPosStart As Single
Dim fYPosEnd As Single
Dim fYPosBreak As Single
Dim rng As Range, rngDummy As Range, rngMeasure As Range
Dim bBreakAtParagraph As Boolean
Dim bBreakManual As Boolean
Dim iLine As Integer
Dim ok As Boolean

    'Find the position underneath the target range.
    Set rng = rngStart
    rng.Collapse wdCollapseEnd
    GetPositionBelow rng, fYPosStart, iPg
    
    'Now find out how much space is left on this page
    'underneath the target range.
    'The possibility of footnotes makes this more difficult,
    'as we can't just use the bottom margin to calculate the
    'free space below.
    
    'we need to find the last line of text that fits (or would fit)
    'onto this page, and add its vertical position to its height.
    
    'Determine what kind of page break follows this page.
    If rng.Information(wdActiveEndPageNumber) = rng.Information(wdNumberOfPagesInDocument) Then
        'This is the last page.
        rng.EndOf wdStory, wdMove
        Set rngDummy = rng
        bForcePageBreak = False
    Else
        'Go to the top of next page.
        Set rng = rng.GoToNext(wdGoToPage)
        Select Case Asc(rng.Previous(wdCharacter, 1).Text)
        Case 12
            'the page break is a manual page or section break.
            Set rngDummy = rng.Previous(wdCharacter, 1)
            rngDummy.Collapse wdCollapseStart
            Set rng = rng.Previous(wdCharacter, 1)
            rng.Collapse wdCollapseStart
            bForcePageBreak = False
        Case 13
            If (rng.ParagraphFormat.PageBreakBefore) Or (rng.ParagraphFormat.KeepWithNext) Or (rng.ParagraphFormat.KeepTogether) Then
                'The page break is due to a special breaking rule
                'applying to the next paragraph.
                'That means the previous line may be
                'not on the bottom of the page!
                Set rngDummy = rng.Previous(wdCharacter, 1)
                rngDummy.Collapse wdCollapseStart
                bForcePageBreak = False
            Else
                'the page break is at a normal paragraph boundary.
                'Assume the paragraph character to represent
                'the last available line on the last page.
                bForcePageBreak = True
                Set rngMeasure = rng.Previous(wdCharacter, 1)
                rngMeasure.Collapse wdCollapseStart
        End If
        Case Else
            'the page break is within a paragraph.
            'Assume the preceding character to represent
            'the last available line on the last page.
            bForcePageBreak = True
            Set rngMeasure = rng.Previous(wdCharacter, 1)
            rngMeasure.Collapse wdCollapseStart
        End Select
    End If
    If Not (rngDummy Is Nothing) Then
        'We have a situation where we can't be sure
        'that the preceding line is on the bottom of
        'the page.
        'Stupid workaround: to see how much will fit
        'onto the page, fill it with empty
        'lines until it spills over.
      
        Do
            iLine = iLine + 1
            rngDummy.InsertBreak wdLineBreak
        Loop Until rngDummy.Information(wdActiveEndPageNumber) > iPg
        
        'Make it one more line, in case Widow Control
        'is active!
        iLine = iLine + 1
        rngDummy.InsertBreak wdLineBreak
        Set rngMeasure = rngDummy.Previous(wdCharacter, 2)
        rngMeasure.Collapse wdCollapseStart
    End If
    
    'Now measure the vertical position underneath
    'the line marked rngMeasure.
    GetPositionBelow rngMeasure, fYPosEnd, 0
    
    'Now delete the dummy filling lines.
    If Not (rngDummy Is Nothing) Then
        rngDummy.MoveStart wdCharacter, -iLine
        rngDummy.Delete
    End If
    
    'Now we've calculated the space available underneath the start position on the same page.
    If fYPosEnd - fYPosStart >= fHeight Then
        
        Set rngMeasure = rng.GoToPrevious(wdGoToLine)
        Do While Not (rngMeasure Is Nothing)
            GetPositionBelow rngMeasure.Characters(1), fYPosBreak, iPg1
            If ((fYPosEnd - fYPosBreak >= fHeight) _
                Or (iPg1 <> iPg)) Then
                Exit Do
            End If
            Set rng = rngMeasure
            Set rngMeasure = rng.GoToPrevious(wdGoToLine)
            bForcePageBreak = True
        Loop
        
        'check if we may break here!
        'otherwise, loop further up.
        Set rngMeasure = rng.GoToPrevious(wdGoToLine)
        Do While (Not (rngMeasure Is Nothing)) And (rng.Information(wdVerticalPositionRelativeToPage) > fYPosStart)
            ok = True
            If rng.Start = rng.Paragraphs(1).Range.Start Then
                If rng.Paragraphs(1).Previous.KeepWithNext Then
                    ok = False
                End If
            Else
                If rng.Paragraphs(1).KeepTogether Then
                    ok = False
                End If
            End If
            If ok Then
                Exit Do
            Else
                Set rng = rng.GoToPrevious(wdGoToLine)
            End If
        Loop
        If ok Then
            FitOnBottom = True
            rng.Collapse wdCollapseStart
            WantToGoAWordBack rng
            Set rngFit = rng
        Else
            bForcePageBreak = False
            FitOnBottom = False
        End If
    End If
End Function

Private Sub GetPositionBelow(rng As Range, fPos As Single, iPg As Long)
Dim iLine As Long
Dim rng1 As Range, rngPar As Range

    Set rng1 = rng
    rng1.Collapse wdCollapseEnd
    
    If Asc(rng1.Previous(wdCharacter, 1).Text) = 13 Then
        rng1.Move wdCharacter, -1
        Set rngPar = rng1
    Else
        Set rngPar = rng1.Paragraphs.Last.Range
        rngPar.MoveEnd wdCharacter, -1
        rngPar.Collapse wdCollapseEnd
    End If

    fPos = rng1.Information(wdVerticalPositionRelativeToPage) + GetLineHeight(rng1)
    If rng1.Information(wdFirstCharacterLineNumber) = rngPar.Information(wdFirstCharacterLineNumber) Then
        fPos = fPos + rng1.ParagraphFormat.SpaceAfter
    End If
    iPg = rng.Information(wdActiveEndPageNumber)

End Sub

Private Function GetLineHeight(rng As Range) As Single
Dim fHeight1 As Long, fHeight2 As Long
Dim rngTbl As Range

    If rng.Information(wdWithInTable) Then
        Set rngTbl = rng.Tables(rng.Tables.Count).Range
        With rngTbl.Cells(rngTbl.Cells.Count)
            Select Case .HeightRule
            Case wdFrameExact
                GetLineHeight = .Height
                Exit Function
            Case wdFrameAtLeast
                fHeight1 = .Height
            End Select
        End With
    End If


'These are approximate varlues only!
With rng.ParagraphFormat
    Select Case .LineSpacingRule
    Case wdLineSpaceExactly, wdLineSpaceAtLeast
        fHeight2 = .LineSpacing
    Case wdLineSpaceSingle
        fHeight2 = rng.font.Size * 1.1
    Case wdLineSpace1pt5
        fHeight2 = rng.font.Size * 1.65
    Case wdLineSpaceDouble
        fHeight2 = rng.font.Size * 2.2
    Case wdLineSpaceMultiple
        fHeight2 = rng.font.Size * .LineSpacing * 1.1
    End Select
End With
If fHeight1 > fHeight2 Then
    GetLineHeight = fHeight2
Else
    GetLineHeight = fHeight1
End If
End Function

Private Sub CutAndMeasure(bkm As Bookmark, doc As Document, fHeight As Single)
Dim rng As Range, rngTarget As Range
Dim iPgStart As Long, iPgEnd As Long, fYPosEnd As Single
Dim fTopMargin As Single
Dim sName As String
    
    sName = bkm.Name
    bkm.Range.Cut
    Set rng = doc.StoryRanges(wdMainTextStory)
    rng.Collapse wdCollapseEnd
    If rng.Information(wdVerticalPositionRelativeToPage) > rng.PageSetup.TopMargin Then
        rng.InsertBreak wdPageBreak
    End If
    iPgStart = rng.Information(wdActiveEndPageNumber)
    
    rng.InsertParagraph
    Set rngTarget = rng
    rngTarget.Paste
    Set bkm = rngTarget.Bookmarks(sName)
    rngTarget.Collapse wdCollapseEnd
    With rngTarget
        fYPosEnd = .Information(wdVerticalPositionRelativeToPage)
        iPgEnd = .Information(wdActiveEndPageNumber)
        fTopMargin = .PageSetup.TopMargin
        fHeight = fYPosEnd - fTopMargin + (iPgEnd - iPgStart) * (.PageSetup.PageHeight - .PageSetup.BottomMargin - fTopMargin)
    End With
End Sub

Private Function ParTrim(sOld As String) As String
Dim iPos As Integer

    For iPos = Len(sOld) To 1 Step -1
        If AscW(Mid$(sOld, iPos, 1)) > 31 Then
            Exit For
        End If
    Next iPos
    If iPos > 0 Then
        ParTrim = Trim$(Left$(sOld, iPos))
    End If

End Function

