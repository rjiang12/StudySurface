//const { userEmail } = require('../index.js');

//console.log(userEmail);

if(document.querySelector('.container')) {
    document.querySelector('.rightBottom1').innerHTML += `
        <iframe src="https://calendar.google.com/calendar/embed?src=roy.jiang.4757%40gmail.com&ctz=America%2FVancouver" frameborder="0" scrolling="no" id="calendar"></iframe>
    `; 

    if(localStorage.getItem("list-items")) document.querySelector('.to-do-list').innerHTML = localStorage.getItem("list-items");
    
      document.addEventListener("keydown", (e) => {
        if(e.code === 'Enter') {
            document.querySelector('.to-do-list').innerHTML += `
              <div class="task">
                  <span id="taskname">
                      <p>${document.querySelector('#my-input').value}</p>
                  </span>
                  <button class="delete">x</button>
              </div>
            `;
            localStorage.setItem("list-items", document.querySelector('.to-do-list').innerHTML);
            document.querySelector('#my-input').value = "";
            const all_tasks = document.querySelectorAll(".delete");
            for(let i = 0; i < all_tasks.length; i++){
                all_tasks[i].addEventListener("click", function(){
                  this.parentNode.remove();
                  localStorage.setItem("list-items", document.querySelector('.to-do-list').innerHTML);
              });
            }
        
      }
    });
    
    const all_tasks = document.querySelectorAll(".delete");
    for(let i = 0; i < all_tasks.length; i++){
        all_tasks[i].addEventListener("click", function(){
        this.parentNode.remove();
        localStorage.setItem("list-items", document.querySelector('.to-do-list').innerHTML);
    });
    }
}
    