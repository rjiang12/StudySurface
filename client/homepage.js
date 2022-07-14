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

    // add gCal iframe
    document.querySelector('.rightBottom1').innerHTML += `
        <iframe src=${calendarLink} frameborder="0" scrolling="no" id="calendar"></iframe>
    `; 

    // add Spotify iframe
    document.querySelector('.rightTop').innerHTML += `
    <iframe src="${spotifyLink}" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" id="playlist"></iframe>
    `

    // restore to-do list as necessary
    if(localStorage.getItem("list-items")) document.querySelector('.to-do-list').innerHTML = localStorage.getItem("list-items");
    
      // to-do list functionality 
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
    
    // delete list items
    const all_tasks = document.querySelectorAll(".delete");
    for(let i = 0; i < all_tasks.length; i++) {
        all_tasks[i].addEventListener("click", function(){
        this.parentNode.remove();
        localStorage.setItem("list-items", document.querySelector('.to-do-list').innerHTML);
        });
    }


    // greet user by first name
    document.querySelector('.userInfo').innerHTML += `
      <center>
        <p>Welcome back, ${name} </p>
      </center>
      <center><button id="logout" onclick="logout()">Log out</button></center>
    `;

    // background change buttons
    document.querySelector('#desk').addEventListener('click', () => {
      document.body.style.background = 'rgba(0, 0, 0, 0.5) url("/assets/homepage_1.jpeg")';
      document.body.style.backgroundSize = 'cover';
    });

    document.querySelector('#forest').addEventListener('click', () => {
      document.body.style.background = 'rgba(0, 0, 0, 0.5) url("/assets/forest.webp")';
      document.body.style.backgroundSize = 'cover';
    });

    document.querySelector('#city').addEventListener('click', () => {
      document.body.style.background = 'rgba(0, 0, 0, 0.5) url("/assets/city.webp")';
      document.body.style.backgroundSize = 'cover';
    });

    document.querySelector('#mountain').addEventListener('click', () => {
      document.body.style.background = 'rgba(0, 0, 0, 0.5) url("/assets/mountain.jpeg")';
      document.body.style.backgroundSize = 'cover';
    });

    document.querySelector('#stars').addEventListener('click', () => {
      document.body.style.background = 'rgba(0, 0, 0, 0.5) url("/assets/stars.jpeg")';
      document.body.style.backgroundSize = 'cover';
    });

    document.querySelector('#blank').addEventListener('click', () => {
      document.body.style.background = 'gray';
      document.body.style.backgroundSize = 'cover';
    });

    // tool toggle buttons
    document.querySelector('#toggleTimer').addEventListener('click', () => {
      document.querySelector('.misc').hidden = !document.querySelector('.misc').hidden;
      if(document.querySelector('.misc').hidden) {
        document.querySelector('.misc').classList.add('.hide'); 
      }
      else {
        document.querySelector('.misc').classList.remove('.hide');
      }
    });

    document.querySelector('#toggleMusic').addEventListener('click', () => {
      document.querySelector('.rightTop').hidden = !document.querySelector('.rightTop').hidden;
      if(document.querySelector('.rightTop').hidden) {
        document.querySelector('.rightTop').classList.add('.hide'); 
      }
      else {
        document.querySelector('.rightTop').classList.remove('.hide');
      }
    });

    document.querySelector('#toggleCalendar').addEventListener('click', () => {
      document.querySelector('.rightBottom1').hidden = !document.querySelector('.rightBottom1').hidden;
      if(document.querySelector('.rightBottom1').hidden) {
        document.querySelector('.rightBottom1').classList.add('.hide'); 
      }
      else {
        document.querySelector('.rightBottom1').classList.remove('.hide');
      }
    });

    document.querySelector('#toggleList').addEventListener('click', () => {
      document.querySelector('.rightBottom2').hidden = !document.querySelector('.rightBottom2').hidden;
      if(document.querySelector('.rightBottom2').hidden) {
        document.querySelector('.rightBottom2').classList.add('.hide'); 
      }
      else {
        document.querySelector('.rightBottom2').classList.remove('.hide');
      }
    });
    
}
    