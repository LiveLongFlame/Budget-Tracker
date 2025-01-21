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
                console.log(file);
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
                    //console.log(text); 

                    // Processing the information and caluating the total amount of money
                    let spent= 0;
                    let withdrawals = 0;
                    let food = 0;
                    let trasport = 0;
                    let bills = 0;
                    let home = 0;
                    let personal = 0;
                    
                    for (let i = 0; i < rows.length; i++) {
                      if (!isNaN(Number(rows[i][2])) && rows[i][5] != "Withdrawals & Transfers") {
                        spent += Number(rows[i][2]);
                      }else if(!isNaN(Number(rows[i][2])) && rows[i][5] == "Withdrawals & Transfers"){
                        withdrawals += Number(rows[i][2]);
                      }

                      if(!isNaN(Number(rows[i][2])) && rows[i][5] == "Food & Beverage"){
                        food += Number(rows[i][2]);
                      }

                      if(!isNaN(Number(rows[i][2])) && rows[i][5] == "Transport & Travel"){
                        trasport += Number(rows[i][2]);
                      }

                      if(!isNaN(Number(rows[i][2])) && rows[i][5] == "Retail & Personal"){
                        personal += Number(rows[i][2]);
                      }

                      if(!isNaN(Number(rows[i][2])) && rows[i][5] == "Bills & Payments"){
                        bills += Number(rows[i][2]);
                      }
                      if(!isNaN(Number(rows[i][2])) && rows[i][5] == "Home & Property"){
                        home += Number(rows[i][2]);
                      }

                    }
                      const catogories = {"Food": food , "transport":trasport , "personal":personal , "bills":bills , "home":home}
                      console.log("Current account is: ", rows[1][4])
                      console.log("Spent Amount: $" , (spent.toFixed(2) * -1))
                      console.log("With Drawn Amount: $" , (withdrawals.toFixed(2) * -1))
                      console.log("Food & Beverage Amount: $" , (food.toFixed(2) * -1))
                      console.log("Transport & Travel Amount: $" , (trasport.toFixed(2) * -1))
                      console.log("Retail & Personal Amount: $" , (personal.toFixed(2) * -1))
                      console.log("Bills & Payments Amount: $" , (bills.toFixed(2) * -1))
                      console.log("Home & Property Amount: $" , (home.toFixed(2) * -1))

                      console.log("\n\n\n")

                      const categoryArray = Object.entries(catogories);

                      // Insertion sort algorithm
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
                      
                      console.log(sortedCategories);

                };
                reader.readAsText(file);
        } else {
            console.log("No file selected.");
        }
    });
});