/*  const AWSRAWDATA = {
    Count: 3,
    Items: [
      {
        createDate: '2017-09-15T16:51:18.830Z',
        vodState: 'COMPLETE',
        houseId: 'testDev-sue-9-15-1',
        updateDate: '2017-09-15T23:47:05.860Z',
        vodJobInfo:
        // tslint:disable-next-line:max-line-length
        '{"title":"Sue Test 9-15 1","matchID":"matchID-test","state":"COMPLETE","files":[{"type":"MEDIA","filename":"testDev-sue-9-15-1_enUS.mp4","runtime":9,"md5":"d06ab6f4f80ee62bd3e3c97c8fea0d27"},{"type":"POSTER","filename":"testDev-sue-9-15-1.jpg","runtime":null,"md5":"9f222fd8f9ff2ef3a5a5e999c8beb253"},{"type":"SUBTITLE","filename":"testDev-sue-9-15-1_enUS.srt","runtime":null,"md5":"bd6a70be9eb37ef6023ef3f69a991cfa"}],"metadata":{"houseID":"testDev-sue-9-15-1","matchID":"matchId-1234","titleFull":"Full title for testDev-sue-9-15-1","summary":"Desription for testDev-sue-9-15-1","franchise":"BlizzCon","category":"Esports","subtitles":false,"embargo":false,"contentType":"Free","ads":false,"status":"Online"},"mediaId":"22f6f0-0009c3c8908","runtimeSeconds":0,"errorDetails":null}'
      },
      {
        "createDate": "2017-09-13T22:19:40.679Z",
        "vodState": "WAITING_FOR_METADATA",
        "houseId": "testDev-sue-9-13-2",
        "updateDate": "2017-09-15T23:35:59.796Z",
        // tslint:disable-next-line:max-line-length
        "vodJobInfo": '{"title":"Sue Test 9-13 2","matchID":"","state":"WAITING_FOR_METADATA","files":[{"type":"MEDIA","filename":"testDev-sue-9-13-2_enUS.mp4","runtime":38,"md5":"74e1f3decdc08323ff76701f990fe054"},{"type":"POSTER","filename":"testDev-sue-9-13-2.jpg","runtime":null,"md5":"aa98a38aaee14ae1a973519f4ecd846a"},{"type":"SUBTITLE","filename":"testDev-sue-9-13-2_enUS.srt","runtime":null,"md5":"bdf67cfc149995bcba09a9f668eed0bf"}],"metadata":{"houseID":"testDev-sue-9-13-2","matchID":"matchId-1234","titleFull":"Full title for testDev-sue-9-13-2","summary":"Desription for testDev-sue-9-13-2","franchise":"BlizzCon","category":"Esports","subtitles":false,"embargo":false,"contentType":"Free","ads":false,"status":"Online"},"mediaId":null,"runtimeSeconds":0,"errorDetails":null}'
      },
      {
        "createDate": "2017-09-13T22:15:50.057Z",
        "vodState": "CONFIMRED",
        "houseId": "testDev-sue-9-13-1",
        "updateDate": "2017-09-15T16:05:56.599Z",
        // tslint:disable-next-line:max-line-length
        "vodJobInfo": '{"title":"Sue Test 9-13 1","matchID":"","state":"CONFIMRED","files":[{"type":"MEDIA","filename":"testDev-sue-9-13-1_enUS.mp4","runtime":19,"md5":"99f9a28a1bd43aa1f9a0da9f153562ae"},{"type":"POSTER","filename":"testDev-sue-9-13-1.jpg","runtime":null,"md5":"aa98a38aaee14ae1a973519f4ecd846a"}],"metadata":{"houseID":"testDev-sue-9-13-1","matchID":"matchId-1234","titleFull":"Full title for testDev-sue-9-13-1","summary":"Desription for testDev-sue-9-13-1","franchise":"BlizzCon","category":"Esports","subtitles":false,"embargo":false,"contentType":"Free","ads":false,"status":"Online"},"mediaId":"22f6f0-0009c386296"}'
      }
    ],
    ScannedCount: 3,
    ConsumedCapacity: 0
  };
   
 */
   
function processSearchResults(reply, textStatus, jqXHR) {
    console.log('got here');
    if (reply["status"] != "success")
    {
        alert("Search failure: " + reply["reason"]);
        return;
    }
    $(".loading").remove();
    $("#results tr").remove();
    var table=$("#results");

    scanData();
    var items = $(".textarea").innerHTML;
    if (items == "") {
        return;
    }

    reply["data"] = items; // AWSRAWDATA.Items;
    var rows=reply["data"];
    for (index in rows)
    {
	var row = rows[index];

/*	if (row["nick"] == null)
	{
	    row["nick"] = "";
	}
*/
    var jobInfo = JSON.parse(row["vodJobInfo"]);
    var title = jobInfo.title;
	table.append("<tr>" +
		     "<td>" + row["houseId"]  + "</td>" +
             "<td>" + title + "</td>" +
             "<td>" + row["createDate"] + "</td>" +
             "<td>" + row["updateDate"] + "</td>" +
             "<td>" + row["vodState"] + "</td>" +
		     "</tr>");
    }
    $("#results").trigger("update");
}
    
function processSearch() {
    $(".loading").show();
    var request = new Object;
    request.searchstring = $("#searchstring").val();
    var reply = new Object;
    reply["status"] = "success";
    processSearchResults(reply);
//    $.getJSON("cgi-bin/factoid-relay.py", request, processSearchResults);
}

function processKeypress(event) {
    if ( event.which == 13 ) {
	event.preventDefault();
	processSearch();
    }
}

function initialize() {
    $("#search").click(processSearch);
    $("#searchstring").keypress(processKeypress);
    $("#resultTable").tablesorter();
    $("#searchstring").focus();

    // Copied from stackoverflow
    var urlParams = {};
    var e,
    a = /\+/g,  // Regex for replacing addition symbol with a space
    r = /([^&=]+)=?([^&]*)/g,
    d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
    q = window.location.search.substring(1);
    
    while (e = r.exec(q)) {
	var param = d(e[1]);
	var value = d(e[2]);

	if (param == "search")
	{
	    var request = new Object;
	    request.searchstring = value;
	    $.getJSON("cgi-bin/factoid-relay.py", request, processSearchResults);
	}
    }
}

$().ready(initialize);
