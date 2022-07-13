//const { userEmail } = require('../index.js');

//console.log(userEmail);

function getName(info) {
  for(const el of info) {
    console.log(el);
    if(el.includes('firstname=')) {
      const initial = el.indexOf('=') + 1;
      const final = el.indexOf('%');
      return el.slice(initial, final); 
    }
  }
  return 'User';
}

function getEmail(info) {
  for(const el of info) {
    if(el.slice(0, 6) === 'email=') return el.slice(6); 
  }
  return '';
}

const info = decodeURIComponent(document.cookie).split(';');
const name = getName(info);
const email = getEmail(info); 
const calendarLink = "https://calendar.google.com/calendar/embed?src=" + email + "&ctz=America%2FVancouver"; 
let spotifyLink = "https://open.spotify.com/embed/playlist/0vvXsWCC9xrXsKd4FyS8kM?utm_source=generator&theme=0"

if(document.querySelector('.container')) {
    document.querySelector('.rightBottom1').innerHTML += `
        <iframe src=${calendarLink} frameborder="0" scrolling="no" id="calendar"></iframe>
    `; 

    document.querySelector('.rightTop').innerHTML += `
    <iframe src="${spotifyLink}" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" id="playlist"></iframe>
    `

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
    for(let i = 0; i < all_tasks.length; i++) {
        all_tasks[i].addEventListener("click", function(){
        this.parentNode.remove();
        localStorage.setItem("list-items", document.querySelector('.to-do-list').innerHTML);
        });
    }
    document.querySelector('.miscBottom').innerHTML += `
      <center>
        <p>Welcome back, ${name} </p>
      </center>
      <center><button id="logout" onclick="logout()">Log out</button></center>
    `
}
    