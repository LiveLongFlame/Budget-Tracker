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
                    console.log("this is the paid amount");
                    let total = 0;
                    for (let i = 1; i < rows.length; i++) {
                      if (!isNaN(Number(rows[i][2]))) {
                        total += Number(rows[i][2]);
                      }
                    }

                      console.log("the total amount spent  is: $" , (total.toFixed(2) * -1))
                };
                reader.readAsText(file);
        } else {
            console.log("No file selected.");
        }
    });
});