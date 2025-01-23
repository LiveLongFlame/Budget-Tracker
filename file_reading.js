document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    const fileInput = document.getElementById('file');
    
    form.addEventListener("submit", function(event) {
        event.preventDefault();  
        //make sure that the files are not empty 
        if(fileInput.length < 0){
            console.log("ERROR NO FILE PROVIDED")
            return;
        }

        const file = fileInput.files[0];  
        if (file) {

                const reader = new FileReader();
                reader.onload = function (e) {
                    // Get the CSV text content
                    const text = e.target.result; 
                
                    // Split text by lines, then split each line into an array of values
                    const lines = text.split("\n");
                    const rows = [];

                    for (let i = 0; i < lines.length; i++) {
                      const elements = lines[i].split(',').map(value => value === "" ? "NULL" : value);
                      rows.push(elements);
                    }

                    // Processing the information and caluating the total amount of money
                    let spent= 0;
                    let withdrawals = 0;
                    let food = 0;
                    let transport = 0;
                    let bills = 0;
                    let home = 0;
                    let retail = 0;
                    let other = 0;
                    let income =0;
                    //* Goes through each catogory of data and sets the values according to its catogotrie
                    for (let i = 0; i < rows.length; i++) {
                      console.log(rows[i][5] , " amount " , rows[i][2])
                      if (!isNaN(Number(rows[i][2])) && rows[i][5] != "Withdrawals & Transfers") {
                        spent += Number(rows[i][2]);
                      }else if(!isNaN(Number(rows[i][2])) && rows[i][5] == "Withdrawals & Transfers"){
                        withdrawals += Number(rows[i][2]);
                      }
                       if(!isNaN(Number(rows[i][2])) && rows[i][5] == "Food & Beverage"){
                        food += Number(rows[i][2]);
                      }else if(!isNaN(Number(rows[i][2])) && rows[i][5] == "Transport & Travel"){
                        transport += Number(rows[i][2]);
                      }else if(!isNaN(Number(rows[i][2])) && rows[i][5] == "Retail & Personal"){
                        retail += Number(rows[i][2]);
                      }else if(!isNaN(Number(rows[i][2])) && rows[i][5] == "Bills & Payments"){
                        bills += Number(rows[i][2]);
                      }else if(!isNaN(Number(rows[i][2])) && rows[i][5] == "Home & Property"){
                        home += Number(rows[i][2]);
                      }else if(!isNaN(Number(rows[i][3])) && rows[i][5] == "Income" ||  rows[i][5] == "Deposits"){
                        income += Number(rows[i][3]);
                      }else{
                        other += Number(rows[i][2]);
                      }
                    }
                    if(isNaN(other)){
                      other = 0;
                    }

                      console.log(income)
                      const catogories = {"food": food , "transport":transport , "retail":retail , "bills":bills , "home":home ,"other":other }
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

                      console.log(sortedCategories)
                     //Shows the information when the user enters a valid file
                    const amount_text = document.getElementById("total_spent");
                    const withdrawn_info = document.getElementById("withdrawn")
                    const income_info = document.getElementById("income");
                    const current_amount_text = document.getElementById("current_amount")
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
                    
                      
                    //prints out withdrawn amoutn of money
                    const withdrawn = document.getElementById("withdrwan_amount")
                    withdrawn.textContent = withdrawals *-1;

                    //prints out the the Income amount 
                    const income_text= document.getElementById("income-text")
                    income_text.textContent = income;
                    //*Catogorire side bar: 
                    //* in order to get the difference of each catogorire we divide the largest value of index 0(1)
                    //*by the next index 1(i+1). 
                    //*then we divide that difference of the max which would be 1000px
                    //*you keep going untill its done

                 

                    function graph(catogoire, entrie , preventrie){
                      let max_width = 1300 / (entrie / preventrie);
                      if(isNaN(max_width) || max_width == 'Infinity' || max_width == 0){
                        max_width = 100;
                      }else if(max_width < 100){
                        max_width = 100 + (100 - max_width)
                      }
                      const item = document.getElementById(catogoire);
                      const item_text = document.getElementById(`${catogoire}-text`)
                      item_text.textContent = '$' + preventrie * -1;
                      item.style.animation = `${catogoire} 1.5s ease-in-out forwards`;
                      item.style.setProperty('--my-end-width', `${max_width}px`);
                    }

                    const entries = Object.entries(sortedCategories);
                    for (let i = 0; i < entries.length; i++) {
                      const key = entries[i][0];
                      const value = entries[i][1];
                      graph(key , entries[0][1], value);
                      console.log(`Key: ${key}, Value: ${value}`);
                    }



                    
                    
                };
                reader.readAsText(file);
                
        } else {
            console.log("No file selected.");
        }
    });
});



function food_info(){
  console.log("Hello this is the food_info")
}

function transport_info(){
  console.log("Hello this is the transport_info")
}

function retail_info(){
  console.log("Hello this is the retail_info")
}

function bills_info(){
  console.log("Hello this is the bills_info")
}

function home_info(){
  console.log("Hello this is the home_info")
}

function other_info(){
  console.log("Hello this is the other_info")
}



function total_spent_btn(){
  const withdrawn = document.getElementById("withdrawn_info")
  withdrawn.style.display = "none";
  const income_text= document.getElementById("income_info")
  income_text.style.display = "none"; 
  const total = document.getElementById("total")
  total.style.display = "block";

  const items = document.getElementById("catogories")
  items.style.display = "block";
}

function withdrawn_info(){
  const total = document.getElementById("total")
  total.style.display = "none";
  const items = document.getElementById("catogories")
  items.style.display = "none";
  const income_text= document.getElementById("income_info")
  income_text.style.display = "none"; 
  const withdrawn = document.getElementById("withdrawn_info")
  withdrawn.style.display = "block";
}


function income_info(){
  const total = document.getElementById("total")
  total.style.display = "none";
  const items = document.getElementById("catogories")
  items.style.display = "none";
  const withdrawn = document.getElementById("withdrawn_info")
  withdrawn.style.display = "none";
  const income_text= document.getElementById("income_info")
  income_text.style.display = "block"; 
}