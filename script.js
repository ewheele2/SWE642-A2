

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
  document.writeln("<a href='javascript:wrongPerson()'>" +
    "Click here if you are not " + name + "</a>")
}

//Resets document cookie
function wrongPerson(){
  document.cookie = "name; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  location.reload();
}

// Data manipulation

//Helper function
function isValid(num) {
  if (num < 1 || num > 100 || isNaN(num)) {
    return false;
  }
  return true;
}


//Survey validation
//
// Helper functions
function isAllLetters(str) {
  let isAllLetters = true;
  for (const char of str) {
    if (!(char >= 'A' && char <= 'Z' || char >= 'a' && char <= 'z' || char == ' ')) {
      isAllLetters = false;
      break;
    }
  }
  return isAllLetters;
}

function isANumber(str) {
  let isNumber = true;
  for (const char of str) {
    if (!(char >= '0' && char <= '9')) {
      isNumber = false;
      break;
    }
  }
  return isNumber;
}

function isAlphaNumeric(str) {
  let alphaNumeric = true;
  for (const char of str) {
    if (!isAllLetters(char) && !isANumber(char)) {
      console.log(char);
      console.log(!isAllLetters(char))

      alphaNumeric = false;
      break;
    }
  }
  return alphaNumeric;
}

function isEmail(str) {
  //Using a small list of top level domains for this
  const allowedTopLevelDomains = ["com", "org", "net", "gov", "edu"];
  let isEmail = true;
  let numberOfAt = 0;
  for (const char of str) {
    if (char == '@')
      numberOfAt++;
  }

  if (numberOfAt == 1) {
    const userDomain = str.split("@");
    const topLevelDomain = userDomain[1].split(".");
    if (!(allowedTopLevelDomains.includes(topLevelDomain[1]))){
      isEmail = false;
    }
  }
  else {
    isEmail = false;
  }
  return isEmail;

}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  const submitBtn = document.getElementById('submitBtn');
  const zipInputElement = document.getElementById('zip'); // FIXED name consistency here
  const dataInputElement = document.getElementById('data-input');

  if (dataInputElement) {
    dataInputElement.addEventListener('blur', function () {
      const trimmedValue = dataInputElement.value.trim();
      const errorSpan = document.getElementById('data-error');
      const avgSpan = document.getElementById('average-placeholder');
      const maxSpan = document.getElementById('maximum-placeholder');

      //Ensures there is a value
      if (trimmedValue === "")
        return;

      //If there's a value, creates a list
      const valueList = trimmedValue.split(",");

      //Checks there's exactly 10 values
      if (valueList.length != 10) {
        errorSpan.textContent = "Please enter 10 comma-separated values.";
        return;
      }

      //Calculates average and max
      let sum = 0;
      let max = 0;

      for (let i = 0; i < valueList.length; i++) {
        const val = Number(valueList[i].trim());
        if (!isValid(val)) {
          errorSpan.textContent = "All values must be numbers between 1 and 100.";
          return;
        }
        sum += val;

        if (val > max)
          max = val;
      }

      const avg = sum / valueList.length;

      avgSpan.textContent = avg;
      maxSpan.textContent = max;

    })
  }


  if (zipInputElement) {
    zipInputElement.addEventListener('blur', function () {
      fetch('zipcodes.json')
        .then(response => response.json())
        .then(data => {
          // FIXED: Adjusted to reference 'zipInputElement' cleanly
          const match = data.zipcodes.find(item => item.zip === zipInputElement.value.trim());

          if (match) {
            document.getElementById('city-placeholder').textContent = match.city;
            document.getElementById('state-placeholder').textContent = match.state;
            document.getElementById('zip-error').textContent = "";
          } else {
            document.getElementById('city-placeholder').textContent = "";
            document.getElementById('state-placeholder').textContent = "";
            document.getElementById('zip-error').textContent = "an invalid zip";
          }
        });
    });
  }


  if (submitBtn) {
    submitBtn.addEventListener('click', function (event) {
      // Get field elements and their values
      const nameElement = document.getElementById('username');
      const addressElement = document.getElementById('address');
      const zipElement = document.getElementById('zip');
      const emailElement = document.getElementById('email');

      const nameInput = nameElement.value;
      const addressInput = addressElement.value;
      const zipInput = zipElement.value;
      const emailInput = emailElement.value;

      const cityInput = document.getElementById('city-placeholder').textContent.trim();
      const stateInput = document.getElementById('state-placeholder').textContent.trim();
      const zipErrorText = document.getElementById('zip-error').textContent;

      // Get selection groups
      const checkboxes = document.querySelectorAll('input[name="liked-most"]:checked');
      const radioButtons = document.querySelectorAll('input[name="interest"]:checked');

      let errors = [];

      // Checks if string is only letters
      if (!isAllLetters(nameInput)) {
        errors.push("Username must contain only letters.")
        nameElement.value = '';
      }

      // Checks address filed only contains alphanumeric
      if (!isAlphaNumeric(addressInput)) {
        errors.push("Street Address contains invalid characters.");
        addressElement.value = '';
      }

      if (!isAllLetters(cityInput) || cityInput === "") {
        errors.push("City contains invalid characters.");
        cityInput.value = '';
      }
      if (!isAllLetters(stateInput) || stateInput === "") {
        errors.push("State contains invalid characters.");
        stateInput.value = '';
      }
      if (!isANumber(zipInput) || zipInput == "" || zipErrorText != "") {
        errors.push("Zip Code contains invalid characters.");
        zipElement.value = '';
        document.getElementById('city-placeholder').innerHTML = "<i>Will automatically populate</i>";
        document.getElementById('state-placeholder').innerHTML = "<i>Will automatically populate</i>";
      }

      // Checks email is valid
      if (!isEmail(emailInput)) {
        errors.push("Email address format is invalid.");
        emailElement.value = '';
      }

      // Checkbox validation: At least two options checked
      if (checkboxes.length < 2) {
        errors.push("Please check at least two checkboxes for what you liked most.");
        document.querySelectorAll('input[name="liked-most"]').forEach(cb => cb.checked = false);
      }

      // Radio button validation: Make sure an option is selected
      if (radioButtons.length == 0) {
        errors.push("Please select an option for how you became interested.");
      }

      //Adds errors from data fields
      const dataErrorText = document.getElementById('data-error').textContent;
      const dataValue = document.getElementById('data-input').value.trim();

      if (dataValue === "" || dataErrorText !== "") {
        console.log(dataErrorText);
        errors.push("Please provide a valid set of 10 data numbers before submitting.");
      }

      // Handle validation results
      if (errors.length > 0) {
        // Stop submission and alert user with consolidated messages
        alert(errors.join('\n'));
      } else {
        alert("Validation successful! Submitting form...");
        form.submit();
      }
    });
  }

  if (form) {
    form.addEventListener('reset', function() {
      document.getElementById('city-placeholder').innerHTML = "<i>Will automatically populate</i>";
      document.getElementById('state-placeholder').innerHTML = "<i>Will automatically populate</i>";
      document.getElementById('zip-error').textContent = "";
      document.getElementById('data-error').textContent = "";
      document.getElementById('average-placeholder').textContent = "0";
      document.getElementById('maximum-placeholder').textContent = "0";
    });
  }

});
getNameCookie();
