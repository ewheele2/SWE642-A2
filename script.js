

//Cookie function
function getNameCookie() {
  //Get hour to determine time of day in greeting and name variable
  var now = new Date();
  var hour = now.getHours();
  var name;

  if (hour < 12)
    document.writeln("<h1>Good Morning, ");
  else {
    hour = hour - 12; //Convert 24 hour time

    if (hour < 6)
      document.writeln("<h1>Good Afternoon, ");
    else
      document.writeln("<h1>Good Evening, ");
  }

  //Determine if there is a Cookie
  if (document.cookie) {
    var cookieTokens = document.cookie.split("=");
    name = decodeURIComponent(cookieTokens[1]);
  }
  else {
    //If no cookie, ask user for their name
    name = window.prompt("Please enter your name");
    document.cookie = "name=" + encodeURIComponent(name) + "; path=/";
  }

  //Finish writing greeting with cookie
  document.writeln(name + ", welcome to SWE642 Survey</h1>")
  document.writeln("<a href='javascript:void(0)' onclick='wrongPerson()'>" +
    "Click here if you are not " + name + "</a>")
}

//Resets document cookie
function wrongPerson(){
  document.cookie = "name=; expires=Thu, 01 Jan 1995 00:00:00 GMT; max-age=0; path=/";
  location.reload();
}

getNameCookie();
