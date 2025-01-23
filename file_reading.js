document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  const fileInput = document.getElementById("file");

  form.addEventListener("submit", function (event) {
    let error_msg = "";
    const error = document.getElementById("error_msg");
    error.innerText = "";
    const error_text = document.getElementById("error");
    error_text.style.display = "none";
    event.preventDefault();
    //make sure that the files are not empty
    if (fileInput.length < 0) {
      alert("ERROR NO FILE PROVIDED");
      return;
    }

    const file = fileInput.files[0];

    // Check if the file is a CSV by MIME type or file extension
    const allowedTypes = ["text/csv", "application/vnd.ms-excel"];
    const allowedExtensions = [".csv"];

    // Check MIME type
    if (!allowedTypes.includes(file.type)) {
      error_msg =
        "Please upload a valid CSV file (MIME type: text/csv or application/vnd.ms-excel).";
    }

    // Check file extension
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(`.${fileExtension}`)) {
      error_msg = "Please upload a valid CSV file (.csv extension).";
    }

    // If there's an error message, display it
    if (error_msg) {
      alert(error_msg);
      return; // Stop further processing if there's an error
    }
    if (file) {
      sessionStorage.clear();
      localStorage.clear();
      const reader = new FileReader();
      reader.onload = function (e) {
        // Get the CSV text content
        const text = e.target.result;

        // Split text by lines, then split each line into an array of values
        const lines = text.split("\n");
        const rows = [];

        for (let i = 0; i < lines.length; i++) {
          const elements = lines[i]
            .split(",")
            .map((value) => (value === "" ? "NULL" : value));
          rows.push(elements);
        }

        //* Processing the information

        let spent = 0;
        let withdrawals = 0;
        let food = 0;
        let transport = 0;
        let bills = 0;
        let home = 0;
        let retail = 0;
        let other = 0;
        let income = 0;
        data = rows;
        //?Checking if a subcatagory exsists in the csv if not then dont add it the table
        //!Error found when the csv is wrong and indexs. Should print error to console to fix solution
        //* Goes through each catogory of data and sets the values according to its catogotrie
        for (let i = 0; i < rows.length; i++) {
          if (
            !isNaN(Number(rows[i][2])) &&
            rows[i][5] != "Withdrawals & Transfers"
          ) {
            spent += Number(rows[i][2]);
          } else if (
            !isNaN(Number(rows[i][2])) &&
            rows[i][5] == "Withdrawals & Transfers"
          ) {
            withdrawals += Number(rows[i][2]);
          }
          if (!isNaN(Number(rows[i][2])) && rows[i][5] == "Food & Beverage") {
            food += Number(rows[i][2]);
          }
          if (
            !isNaN(Number(rows[i][2])) &&
            rows[i][5] == "Transport & Travel"
          ) {
            transport += Number(rows[i][2]);
          }
          if (!isNaN(Number(rows[i][2])) && rows[i][5] == "Retail & Personal") {
            retail += Number(rows[i][2]);
          }
          if (!isNaN(Number(rows[i][2])) && rows[i][5] == "Bills & Payments") {
            bills += Number(rows[i][2]);
          }
          if (!isNaN(Number(rows[i][2])) && rows[i][5] == "Home & Property") {
            home += Number(rows[i][2]);
          }
          if (
            (!isNaN(Number(rows[i][3])) && rows[i][5] == "Income") ||
            rows[i][5] == "Deposits"
          ) {
            income += Number(rows[i][3]);
          } else {
            other += Number(rows[i][2]);
          }

          if (i > 0 && isNaN(rows[i][2]) && isNaN(rows[i][3])) {
            for (let j = 0; j < rows[i].length; j++) {
              if (rows[i][j].length > 5) {
                error_msg += `${rows[i][j]}, `;
              }
            }

            // If there's any error message, show it in an alert
            if (error_msg) {
              const error = document.getElementById("error_msg");
              error.innerText = error_msg;
              const error_text = document.getElementById("error");
              error_text.style.display = "block";
            }
          }
        }
        if (isNaN(other)) {
          other = 0;
        }

        console.log(income);
        const catogories = {
          food: food,
          transport: transport,
          retail: retail,
          bills: bills,
          home: home,
          other: other,
        };
        const categoryArray = Object.entries(catogories);

        //* Insertion sort algorithm to orgainse array
        for (let i = 1; i < categoryArray.length; i++) {
          let key = categoryArray[i];
          let j = i - 1;

          // Move elements that are smaller than key[1] one position ahead
          while (j >= 0 && categoryArray[j][1] < key[1]) {
            categoryArray[j + 1] = categoryArray[j];
            j--;
          }
          categoryArray[j + 1] = key;
        }

        // Convert the sorted array back into an object
        const sortedCategories = Object.fromEntries(categoryArray);

        //Shows the information when the user enters a valid file
        const amount_text = document.getElementById("total_spent");
        const withdrawn_info = document.getElementById("withdrawn");
        const income_info = document.getElementById("income");
        const current_amount_text = document.getElementById("current_amount");
        current_amount_text.style.display = "block";
        amount_text.style.display = "block";
        withdrawn_info.style.display = "block";
        income_info.style.display = "block";

        //prints out the total amount spent onto the html page
        const amount = document.getElementById("total-number");
        amount.textContent = spent.toFixed(2) * -1;
        //prints out the amount currenlty inside the account
        const current = document.getElementById("current");
        current.textContent = rows[1][4];
        current.style.color = "#9551a6";

        //prints out withdrawn amoutn of money
        const withdrawn = document.getElementById("withdrwan_amount");
        withdrawn.textContent = withdrawals * -1;

        //prints out the the Income amount
        const income_text = document.getElementById("income-text");
        income_text.textContent = income;
        //*Catogorire side bar:
        //* in order to get the difference of each catogorire we divide the largest value of index 0(1)
        //*by the next index 1(i+1).
        //*then we divide that difference of the max which would be 1000px
        //*you keep going untill its done

        function graph(catogoire, entrie, preventrie) {
          let max_width = 1300 / (entrie / preventrie);
          if (isNaN(max_width) || max_width == "Infinity" || max_width == 0) {
            max_width = 100;
          } else if (max_width < 100) {
            max_width = 100 + (100 - max_width);
          }
          const item = document.getElementById(catogoire);
          const item_text = document.getElementById(`${catogoire}-text`);
          item_text.textContent = "$" + preventrie * -1;
          item.style.animation = `${catogoire} 1.5s ease-in-out forwards`;
          item.style.setProperty("--my-end-width", `${max_width}px`);
        }

        const entries = Object.entries(sortedCategories);
        for (let i = 0; i < entries.length; i++) {
          const key = entries[i][0];
          const value = entries[i][1];
          graph(key, entries[0][1], value);
          // console.log(`Key: ${key}, Value: ${value}`);
        }

        //* Function generates and add tables data according to each subheading
        function gen_table(table_name, col, catoegory1, catoegory2) {
          const table = document.getElementById(table_name);
          //*clears table
          table.innerHTML = "";
          const heading = document.createElement("tr");
          const date = document.createElement("th");
          date.textContent = "Date";
          heading.appendChild(date);

          const amount_header = document.createElement("th");
          amount_header.textContent = "Amount";
          heading.appendChild(amount_header);

          const account_bal = document.createElement("th");
          account_bal.textContent = "Account Balance";
          heading.appendChild(account_bal);

          table.appendChild(heading);

          if (rows[0][6] && rows[0][6].length > 1) {
            const sub_category_header = document.createElement("th");
            sub_category_header.textContent = "SubCategory";
            table.rows[0].appendChild(sub_category_header);
          }

          for (let i = 0; i < rows.length; i++) {
            //* Adds information and populates table for income information and data
            if (
              (!isNaN(Number(rows[i][col])) && rows[i][5] == catoegory1) ||
              rows[i][5] == catoegory2
            ) {
              // Create a new row
              const newRow = document.createElement("tr");

              // Create and append cells for Date, Amount, and Balance
              const dateCell = document.createElement("td");
              dateCell.textContent = rows[i][0];
              newRow.appendChild(dateCell);

              const amountCell = document.createElement("td");
              amountCell.textContent = "$" + rows[i][col];
              amountCell.classList.add("amount");
              newRow.appendChild(amountCell);

              const balanceCell = document.createElement("td");
              // Prefix "$" and set textContent
              balanceCell.textContent = "$" + rows[i][4];
              newRow.appendChild(balanceCell);

              if (rows[i][6].length > 1) {
                const sub_category = document.createElement("td");
                sub_category.textContent = rows[i][6];
                newRow.appendChild(sub_category);
              }

              // Append the row to the table
              table.appendChild(newRow);
            }
          }
        }
        //?Can make the program more dynmatic instead of static
        gen_table("data_table", 3, "Income", "Deposits");
        gen_table("withdrawn_table", 2, "Withdrawals & Transfers", "");
        gen_table("food_data", 2, "Food & Beverage", "");
        gen_table("transport_table", 2, "Transport & Travel", "");
        gen_table("retail_table", 2, "Retail & Personal", "");
        gen_table("bills_table", 2, "Bills & Payments", "");
        gen_table("home_table", 2, "Home & Property", "");
      };
      reader.readAsText(file);
    } else {
      console.log("No file selected.");
    }
  });
});

function food_info() {
  const transport_div = document.getElementById("transport_div");
  transport_div.style.display = "none";
  const retail_div = document.getElementById("retail_div");
  retail_div.style.display = "none";
  const food_table = document.getElementById("food_data");
  food_table.style.display = "table";

  const food_div = document.getElementById("food_div");

  if (food_div.style.display === "none" || food_div.style.display === "") {
    food_div.style.display = "block";
  } else {
    food_div.style.display = "none";
  }
}

function transport_info() {
  const food_div = document.getElementById("food_div");
  food_div.style.display = "none";
  const retail_div = document.getElementById("retail_div");
  retail_div.style.display = "none";

  const transport_table = document.getElementById("transport_table");
  transport_table.style.display = "table";

  const transport_div = document.getElementById("transport_div");

  if (
    transport_div.style.display === "none" ||
    transport_div.style.display === ""
  ) {
    transport_div.style.display = "block";
  } else {
    transport_div.style.display = "none";
  }
}

function retail_info() {
  const food_div = document.getElementById("food_div");
  food_div.style.display = "none";
  const transport_div = document.getElementById("transport_div");
  transport_div.style.display = "none";

  const retail_table = document.getElementById("retail_table");
  retail_table.style.display = "table";

  const retail_div = document.getElementById("retail_div");

  if (retail_div.style.display === "none" || retail_div.style.display === "") {
    retail_div.style.display = "block";
  } else {
    retail_div.style.display = "none";
  }
}

function bills_info() {
  const food_div = document.getElementById("food_div");
  food_div.style.display = "none";
  const transport_div = document.getElementById("transport_div");
  transport_div.style.display = "none";
  const retail_div = document.getElementById("retail_div");
  retail_div.style.display = "none";

  const bills_table = document.getElementById("bills_table");
  bills_table.style.display = "table";

  const bills_div = document.getElementById("bills_div");

  if (bills_div.style.display === "none" || bills_div.style.display === "") {
    bills_div.style.display = "block";
  } else {
    bills_div.style.display = "none";
  }
}

function home_info() {
  const food_div = document.getElementById("food_div");
  food_div.style.display = "none";
  const transport_div = document.getElementById("transport_div");
  transport_div.style.display = "none";
  const retail_div = document.getElementById("retail_div");
  retail_div.style.display = "none";
  const bills_div = document.getElementById("bills_div");
  bills_div.style.display = "none";

  const home_table = document.getElementById("home_table");
  home_table.style.display = "table";

  const home_div = document.getElementById("home_div");

  if (home_div.style.display === "none" || home_div.style.display === "") {
    home_div.style.display = "block";
  } else {
    home_div.style.display = "none";
  }
}

function other_info() {
  //* Other does not need table however in future might to add catgory
}

function total_spent_btn() {
  const withdrawn = document.getElementById("withdrawn_info");
  withdrawn.style.display = "none";
  const income_text = document.getElementById("income_info");
  income_text.style.display = "none";
  const income_table = document.getElementById("data_table");
  income_table.style.display = "none";
  const withdrawn_table = document.getElementById("withdrawn_table");
  withdrawn_table.style.display = "none";

  const total = document.getElementById("total");
  total.style.display = "block";
  const total_number = document.getElementById("total-number");
  total_number.style.color = "#e2252b";

  const items = document.getElementById("catogories");
  items.style.display = "block";
}

function withdrawn_info() {
  const total = document.getElementById("total");
  total.style.display = "none";
  const items = document.getElementById("catogories");
  items.style.display = "none";
  const income_text = document.getElementById("income_info");
  income_text.style.display = "none";
  const income_table = document.getElementById("data_table");
  income_table.style.display = "none";
  const withdrawn = document.getElementById("withdrawn_info");
  withdrawn.style.display = "block";
  const withdrwan_amount = document.getElementById("withdrwan_amount");
  withdrwan_amount.style.color = "#ffa500";
  const withdrawn_table = document.getElementById("withdrawn_table");
  withdrawn_table.style.display = "table";
}

function income_info() {
  const total = document.getElementById("total");
  total.style.display = "none";
  const items = document.getElementById("catogories");
  items.style.display = "none";
  const withdrawn = document.getElementById("withdrawn_info");
  withdrawn.style.display = "none";
  const withdrawn_table = document.getElementById("withdrawn_table");
  withdrawn_table.style.display = "none";
  const income_table = document.getElementById("data_table");
  income_table.style.display = "table";
  income_table.style.opacity = "1";
  const income_text = document.getElementById("income_info");
  income_text.style.display = "block";
  const income_number = document.getElementById("income-text");
  income_number.style.color = "#41bc4f";
}
