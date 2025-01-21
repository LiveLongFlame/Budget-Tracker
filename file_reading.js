//todo: make code cleaner and easier to read
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
                    //console.log(text); 

                    // Processing the information and caluating the total amount of money
                    let spent= 0;
                    let withdrawals = 0;
                    let food = 0;
                    let trasport = 0;
                    let bills = 0;
                    let home = 0;
                    let personal = 0;
                    let other = 0;
                    
                    for (let i = 0; i < rows.length; i++) {
                      if (!isNaN(Number(rows[i][2])) && rows[i][5] != "Withdrawals & Transfers") {
                        spent += Number(rows[i][2]);
                      }else if(!isNaN(Number(rows[i][2])) && rows[i][5] == "Withdrawals & Transfers"){
                        withdrawals += Number(rows[i][2]);
                      }
                       if(!isNaN(Number(rows[i][2])) && rows[i][5] == "Food & Beverage"){
                        food += Number(rows[i][2]);
                      }else if(!isNaN(Number(rows[i][2])) && rows[i][5] == "Transport & Travel"){
                        trasport += Number(rows[i][2]);
                      }else if(!isNaN(Number(rows[i][2])) && rows[i][5] == "Retail & Personal"){
                        personal += Number(rows[i][2]);
                      }else if(!isNaN(Number(rows[i][2])) && rows[i][5] == "Bills & Payments"){
                        bills += Number(rows[i][2]);
                      }else if(!isNaN(Number(rows[i][2])) && rows[i][5] == "Home & Property"){
                        home += Number(rows[i][2]);
                      }else{
                        other += Number(rows[i][2]);
                      }

                    }
                    if(isNaN(other)){
                      other =0;
                    }
                      const catogories = {"food": food , "transport":trasport , "personal":personal , "bills":bills , "home":home ,"other":other}
                      console.log("Current account is: ", rows[1][4])
                      console.log("Spent Amount: $" , (spent.toFixed(2) * -1))
                      console.log("With Drawn Amount: $" , (withdrawals.toFixed(2) * -1))
                      console.log("Food & Beverage Amount: $" , (food.toFixed(2) * -1))
                      console.log("Transport & Travel Amount: $" , (trasport.toFixed(2) * -1))
                      console.log("Retail & Personal Amount: $" , (personal.toFixed(2) * -1))
                      console.log("Bills & Payments Amount: $" , (bills.toFixed(2) * -1))
                      console.log("Home & Property Amount: $" , (home.toFixed(2) * -1))
                      console.log("Other Amount: $" , other.toFixed(2))

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


                    
                    const amount_text = document.getElementById("total_spent");
                    const current_amount_text = document.getElementById("current_amount")
                    amount_text.style.display = "block";
                    current_amount_text.style.display = "block";
                    //prints out the total amount spent onto the html page
                    const amount = document.getElementById("amount");
                    amount.textContent = spent.toFixed(2) * -1;
                    
                    const current = document.getElementById("current")
                    current.textContent = rows[1][4];
                    

                    //todo: Fix the bars maths as they are all displaying as equal but there not 
                    //todo: add the amount so that its at the edge of the width bar 
                    //todo: fix organsiation of catogories as they are HARD CODED however they should be dynmacally changing, where what ever is at the top is the biggest to smallest 
                    //todo: change color and pretty up bar
                    //*Catogorire side bar: 
                    //* in order to get the difference of each catogorire we divide the largest value of index 0(1)
                    //*by the next index 1(i+1). 
                    //*then we divide that difference of the max which would be 1000px
                    //*you keep going untill its done
                      // Create a style element to inject dynamic CSS
                      const style = document.createElement('style');
                      document.head.appendChild(style);
                    function updateKeyframes(table_name , max) {
                      const keyframes = `
                          @keyframes ${table_name} {
                              0% {
                                  width: 100px;
                              }
                              100% {
                                  width: ${max}px;
                              }
                          }
                      `;
                      
                      
                      style.innerHTML = keyframes;
                  }

                  //! DO NOT HARD CODE THIS MAKE THIS BETTER !!!
                  //todo: do not hard code got to find better solution
                  //Goes through key array and prints out key and value assotive
                  const entries = Object.entries(sortedCategories);
                  for (let i = 0; i < entries.length; i++) {
                    const key = entries[i][0];
                    const value = entries[i][1];
                    console.log(`Key: ${key}, Value: ${value}`);
                  }


                  //show data: 
                  const cataogores_data = document.getElementById("catogories")
                  cataogores_data.style.display = "block";

                  // Helper function to update category animations and text
                  function updateCategoryAnimation(category, entryValue, prevEntryValue) {
                    const textElement = document.getElementById(`${category}-text`);
                    const dataDisplay = document.getElementById(category);
                
                    // Update text content with negative value
                    textElement.textContent = entryValue * -1;
                  
                    // Calculate max width, handling division by zero
                    let max_width;
                    console.log(prevEntryValue)
                    if (prevEntryValue === 'Infinity') {
                        max_width = 100; // Avoid infinite width
                    } else {
                        max_width = 1000 / (prevEntryValue / entryValue);
                    }
                  
                    // Apply animation and update keyframes
                    dataDisplay.style.animation = `${category} 1.5s ease-in-out forwards`;
                    updateKeyframes(category, max_width);
                  }

                  // Main logic for categories
                  const categories = ['food', 'retail', 'transport', 'home', 'bills', 'other'];

                  for (let index = 0; index < categories.length; index++) {
                    const category = categories[index];
                    const entryValue = entries[index][1];
                    
                    let prevEntryValue;
                    if (index > 0) {
                      prevEntryValue = entries[index - 1][1];
                    } else {
                      prevEntryValue = entryValue;
                    }
                  
                    updateCategoryAnimation(category, entryValue, prevEntryValue);
                  }

               

                      

                };
                reader.readAsText(file);
        } else {
            console.log("No file selected.");
        }
    });
});