
function showObjProps(obj)
{
	var i, w, count, name, objval, objtype;
   var options = "dependent=true,location=false," +
				"personalbar=false,toolbar=false";
   w = open("", "");
   if (obj.name)
      name = "Object name `" + obj.name + "'";
   else
      name = "Unnamed " + " object";
   if (obj.type)
     	name += " (type = <span class=\"type\">" + obj.type + "</span>)";
   w.document.write(
       "<html>\n<head>\n<title>Properties of Objects</title>\n" +
       "<style type=\"text/css\">\n" +
       "TD {background-color:#fff8e0;}\n" +
       "TH {background-color:#f0f0ff;color:black;font:bold 100%Arial,sans-serif;}\n" +
       "CAPTION {background-color:#990000;color:#f8f8f8;font:bold 83% Helvetica,Arial;}\n" +
       "TD, TH {padding:0 1em;}\n" +
       ".type {color:yellow;font-size:115%;}\n" +
       "</style>\n" +
       "</head>\n<body>\n" +
       "<center><table style=\"background-color:#aaaaaa;\">\n" +
       "<caption>" + name + "</caption>\n" +
       "<col style=\"text-align:right;font:bold 90% Verdana,Tahoma,Arial,sans-serif;color:blue;\">\n" +
       "<col style=\"font:bold 83% Tahoma,Arial,sans-serif;\">\n" +
       "<col style=\"font:bold 90% 'Courier New',Courier,monospace;\">\n" +
       "<col style=\"font:normal 100% 'Courier New',Courier,monospace;color:green;\">\n" +
       "<tr><th><th>Type<th>Property<th>Value\n");
   count = 0;
   for (i in obj)
   {
	 if ((objtype = typeof(objval = obj[i])) == "string" && objval == "")
        objval = "--&lt;empty string&gt;--";
    	w.document.writeln("<tr><td>" + ++count +
                         		"<td>" + objtype +
                              "<td>" + i +
                              "<td>" + objval);
	}
   w.document.write("</table></center>\n</body>\n</html>\n");
}

function showDocTree()
{
	document.writeln("<hr><p><b>Error in JavaScript processing</b>\n" +
                       "<br>Error = " + Error.description +
			              "\n<h1>Document Object Tree</h1>\n" +
         					"<b><i>Object</i></b><pre><code>");
   showObjProps(document, 0);
   document.writeln("\n</code></pre>");
   alert("To continue, press OK or Enter key");
	return (false)
}
