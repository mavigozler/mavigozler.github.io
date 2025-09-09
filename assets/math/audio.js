/*
   Do the following:
   1. insert <script type="text/javascript" src="audio.js">
       element in <head> section
   2. put this tag also in the head section  <bgsound id="auIEEmb">
   3. in <body> tag,  put "loadSounds();" as expression in an
      onLoad handler attribute
   4. insert in a <script> element, and as a global, an array literal
      called 'soundFiles', with the elements being strings which
      are fully qualifiable names to playable (usually .wav) sound
      files.  This array must be initialized before loadSounds()
      is called.
 */

// by JS Archive - http://jsarchive.8m.com

function audioCheck()
{
	var n = navigator.appName;
   if (n == "Netscape")
   	this.ns = true;
  	else if (n == "Microsoft Internet Explorer" && document.all)
     	this.ie = true;
	else
     	this.noAudio = true;
}

function loadSounds()
{
	is = new audioCheck();
	if (!is.noAudio)
   {

		var s = '';
		for (var i = 0; i < soundFiles.length; i++)
			s += "<embed src=\"" + soundFiles[i] +
					      	"\" autostart=\"false\" hidden=\"true\">"

		if (is.ns)
	   {
			auEmb = new Layer(0);
	      with (auEmb.document)
	      {
	       	open();
	         write(s);
	         close();
			}
		}
	   else
	     	document.body.insertAdjacentHTML("BeforeEnd", s);

		auCon = is.ns ? auEmb.document.embeds : auIEEmb;
	   auCon.ctrl = function(play, idx)
	   {
	   	if (is.ie)
	        	this.src = play ? soundFiles[idx] : '';
			else
	        	eval("this[au]." + (play ? "play()" : "stop()"));
	  	}
	   is.auDone = true;
	}
}

function playAudio(sndfileidx)
{
 	if (window.auCon)
     	auCon.ctrl(1, sndfileidx);
}

function stopAudio(sndfileidx)
{
	if (window.auCon)
		auCon.ctrl(0, sndfileidx);
}

