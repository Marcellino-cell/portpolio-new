/*==========================================
LOADING SCREEN
==========================================*/

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    loader.style.opacity = "0";

    setTimeout(() => {

        loader.style.display = "none";

    }, 500);

});


/*==========================================
SCROLL PROGRESS BAR
==========================================*/

const progressBar = document.getElementById("progress-bar");

window.addEventListener("scroll", () => {

    const scrollTop = document.documentElement.scrollTop;

    const height = document.documentElement.scrollHeight -
                   document.documentElement.clientHeight;

    const progress = (scrollTop / height) * 100;

    progressBar.style.width = progress + "%";

});


/*==========================================
STICKY NAVBAR
==========================================*/

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 40) {

        header.style.boxShadow =
        "0 10px 25px rgba(0,0,0,.08)";

        header.style.background =
        "rgba(255,255,255,.95)";

    } else {

        header.style.boxShadow = "none";

        header.style.background =
        "rgba(255,255,255,.9)";

    }

});


/*==========================================
BACK TO TOP
==========================================*/

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

        topBtn.style.display = "flex";

        topBtn.style.alignItems = "center";

        topBtn.style.justifyContent = "center";

    } else {

        topBtn.style.display = "none";

    }

});

topBtn.addEventListener("click", () => {

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});


/*==========================================
HAMBURGER MENU
==========================================*/

const menuBtn = document.querySelector(".menu-btn");

const navMenu = document.querySelector(".nav-menu");

menuBtn.addEventListener("click", () => {

    navMenu.classList.toggle("active");

});


/*==========================================
AUTO CLOSE MENU
==========================================*/

document.querySelectorAll(".nav-menu a")

.forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("active");

    });

});


/*==========================================
ACTIVE MENU
==========================================*/

const sections = document.querySelectorAll("section");

const navLinks = document.querySelectorAll(".nav-menu a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 120;

        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (

            link.getAttribute("href") === "#" + current

        ){

            link.classList.add("active");

        }

    });

});


/*==========================================
SMOOTH SCROLL
==========================================*/

document.querySelectorAll('a[href^="#"]')

.forEach(anchor => {

anchor.addEventListener("click", function(e){

e.preventDefault();

const target = document.querySelector(

this.getAttribute("href")

);

if(target){

target.scrollIntoView({

behavior:"smooth"

});

}

});

});

/*==========================================
DARK MODE
==========================================*/

const themeButton = document.querySelector("#theme-toggle");
const body = document.body;

// cek tema sebelumnya
const savedTheme = localStorage.getItem("theme");

if(savedTheme === "dark"){

    body.classList.add("dark");

    themeButton.innerHTML =
    '<i class="fa-solid fa-sun"></i>';

}

themeButton.addEventListener("click",()=>{

    body.classList.toggle("dark");

    if(body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

        themeButton.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

    }else{

        localStorage.setItem("theme","light");

        themeButton.innerHTML =
        '<i class="fa-solid fa-moon"></i>';

    }

});


/*==========================================
TYPING EFFECT
==========================================*/

const typingText = document.getElementById("typing");

const words = [

"Frontend Developer",

"UI / UX Designer",

"Web Developer",

"JavaScript Enthusiast"

];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typingEffect(){

    const currentWord = words[wordIndex];

    if(!deleting){

        typingText.textContent =
        currentWord.substring(0,charIndex++);

        if(charIndex > currentWord.length){

            deleting = true;

            setTimeout(typingEffect,1200);

            return;

        }

    }else{

        typingText.textContent =
        currentWord.substring(0,charIndex--);

        if(charIndex < 0){

            deleting = false;

            wordIndex++;

            if(wordIndex >= words.length){

                wordIndex = 0;

            }

        }

    }

    setTimeout(

        typingEffect,

        deleting ? 45 : 110

    );

}

typingEffect();

/*==========================================
SKILL ANIMATION
==========================================*/

const skillBars = document.querySelectorAll(".fill");

const skillObserver = new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.animation =
"progress 2s ease forwards";

skillObserver.unobserve(entry.target);

}

});

},

{

threshold:.5

}

);

skillBars.forEach(bar=>{

bar.style.animation="none";

skillObserver.observe(bar);

});


/*==========================================
SCROLL REVEAL
==========================================*/

const reveals = document.querySelectorAll(

".section-title,.about-container,.timeline-item,.skill-card,.project-card,.experience-box,#contact-form"

);

const revealObserver = new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

},

{

threshold:.15

}

);

reveals.forEach(item=>{

revealObserver.observe(item);

});

/*==========================================
TOAST NOTIFICATION
==========================================*/

function showToast(message){

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.classList.add("show");

    },100);

    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(()=>{

            toast.remove();

        },400);

    },3000);

}


/*==========================================
CONTACT FORM
==========================================*/

const contactForm = document.getElementById("contact-form");

if(contactForm){

contactForm.addEventListener("submit",(e)=>{

e.preventDefault();

showToast("✅ Pesan berhasil dikirim.");

contactForm.reset();

});

}


/*==========================================
RIPPLE BUTTON
==========================================*/

document.querySelectorAll(

".btn,.btn-small,.btn-outline,#contact-form button"

).forEach(button=>{

button.addEventListener("click",function(e){

const ripple=document.createElement("span");

const rect=this.getBoundingClientRect();

const size=Math.max(rect.width,rect.height);

ripple.style.width=size+"px";

ripple.style.height=size+"px";

ripple.style.left=(e.clientX-rect.left-size/2)+"px";

ripple.style.top=(e.clientY-rect.top-size/2)+"px";

ripple.classList.add("ripple");

this.appendChild(ripple);

setTimeout(()=>{

ripple.remove();

},600);

});

});


/*==========================================
CUSTOM CURSOR
==========================================*/

const cursor=document.createElement("div");

cursor.className="cursor";

document.body.appendChild(cursor);

document.addEventListener("mousemove",(e)=>{

cursor.style.left=e.clientX+"px";

cursor.style.top=e.clientY+"px";

});

document.querySelectorAll("a,button").forEach(item=>{

item.addEventListener("mouseenter",()=>{

cursor.classList.add("active");

});

item.addEventListener("mouseleave",()=>{

cursor.classList.remove("active");

});

});

/*==========================================
FLOATING SHAPES
==========================================*/

for(let i=0;i<15;i++){

const shape=document.createElement("span");

shape.className="shape";

shape.style.left=Math.random()*100+"%";

shape.style.animationDuration=

5+Math.random()*8+"s";

shape.style.animationDelay=

Math.random()*5+"s";

document.body.appendChild(shape);

}


/*==========================================
CARD TILT EFFECT
==========================================*/

document.querySelectorAll(

".project-card,.skill-card,.box"

).forEach(card=>{

card.addEventListener("mousemove",(e)=>{

const rect=card.getBoundingClientRect();

const x=e.clientX-rect.left;

const y=e.clientY-rect.top;

const rotateY=(x-rect.width/2)/18;

const rotateX=-(y-rect.height/2)/18;

card.style.transform=

`perspective(1000px)

rotateX(${rotateX}deg)

rotateY(${rotateY}deg)

scale(1.04)`;

});

card.addEventListener("mouseleave",()=>{

card.style.transform="";

});

});


/*==========================================
COPY EMAIL
==========================================*/

const emailElement=document.querySelector(".copy-email");

if(emailElement){

emailElement.addEventListener("click",()=>{

navigator.clipboard.writeText(

"emailanda@gmail.com"

);

showToast("📧 Email berhasil disalin.");

});

}

/*==========================================
CONTACT VALIDATION
==========================================*/

const form = document.getElementById("contact-form");

if(form){

form.addEventListener("submit",(e)=>{

e.preventDefault();

const inputs=form.querySelectorAll("input,textarea");

let valid=true;

inputs.forEach(input=>{

if(input.hasAttribute("required") && input.value.trim()===""){

valid=false;

input.style.border="2px solid red";

}else{

input.style.border="none";

}

});

if(valid){

showToast("✅ Pesan berhasil dikirim.");

form.reset();

}

});

}


/*==========================================
LAZY IMAGE
==========================================*/

const lazyImages=document.querySelectorAll("img");

const imageObserver=new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

const img=entry.target;

img.style.opacity="1";

imageObserver.unobserve(img);

}

});

});

lazyImages.forEach(img=>{

img.style.opacity="0";

img.style.transition=".8s";

imageObserver.observe(img);

});


/*==========================================
TITLE ANIMATION
==========================================*/

const titles=document.querySelectorAll(".section-title h2");

titles.forEach(title=>{

title.addEventListener("mouseenter",()=>{

title.style.transform="scale(1.05)";

});

title.addEventListener("mouseleave",()=>{

title.style.transform="scale(1)";

});

});


/*==========================================
HERO IMAGE HOVER
==========================================*/

const hero=document.querySelector(".hero-right img");

if(hero){

hero.addEventListener("mouseenter",()=>{

hero.style.transition=".4s";

hero.style.transform="scale(1.05)";

});

hero.addEventListener("mouseleave",()=>{

hero.style.transform="scale(1)";

});

}


/*==========================================
THROTTLE SCROLL
==========================================*/

function throttle(callback,delay){

let wait=false;

return function(){

if(wait)return;

callback.apply(this,arguments);

wait=true;

setTimeout(()=>{

wait=false;

},delay);

};

}

window.addEventListener(

"scroll",

throttle(()=>{

document.body.dataset.scroll=window.scrollY;

},50)

);


/*==========================================
SECTION ACTIVE EFFECT
==========================================*/

const allSections=document.querySelectorAll("section");

const activeObserver=new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("section-active");

}

});

},

{

threshold:.2

}

);

allSections.forEach(section=>{

activeObserver.observe(section);

});


/*==========================================
KEYBOARD SHORTCUT
==========================================*/

document.addEventListener("keydown",(e)=>{

if(e.key==="Home"){

window.scrollTo({

top:0,

behavior:"smooth"

});

}

});


/*==========================================
CONSOLE MESSAGE
==========================================*/

console.log("%cPortfolio Website","color:#8B5CF6;font-size:24px;font-weight:bold;");

console.log("Created with HTML CSS JavaScript");


/*==========================================
FINISHED
==========================================*/

console.log("All Features Loaded Successfully.");

/*==========================================
SPOTLIGHT EFFECT
==========================================*/

const spotlight = document.getElementById("spotlight");

if (spotlight) {
    document.addEventListener("mousemove", (e) => {
        spotlight.style.left = e.clientX + "px";
        spotlight.style.top = e.clientY + "px";
    });
}

/*==========================================
NETWORK BACKGROUND
==========================================*/

const canvas = document.getElementById("networkCanvas");

if (canvas) {

const ctx = canvas.getContext("2d");

function resizeCanvas(){

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

const dots = [];

for(let i=0;i<60;i++){

dots.push({

x:Math.random()*canvas.width,
y:Math.random()*canvas.height,

vx:(Math.random()-0.5)*0.5,
vy:(Math.random()-0.5)*0.5

});

}

function animate(){

ctx.clearRect(0,0,canvas.width,canvas.height);

dots.forEach(dot=>{

dot.x+=dot.vx;
dot.y+=dot.vy;

if(dot.x<0||dot.x>canvas.width) dot.vx*=-1;
if(dot.y<0||dot.y>canvas.height) dot.vy*=-1;

ctx.beginPath();

ctx.arc(dot.x,dot.y,2,0,Math.PI*2);

ctx.fillStyle="#8B5CF6";

ctx.fill();

});

for(let i=0;i<dots.length;i++){

for(let j=i+1;j<dots.length;j++){

const dx=dots[i].x-dots[j].x;
const dy=dots[i].y-dots[j].y;

const dist=Math.sqrt(dx*dx+dy*dy);

if(dist<130){

ctx.beginPath();

ctx.moveTo(dots[i].x,dots[i].y);

ctx.lineTo(dots[j].x,dots[j].y);

ctx.strokeStyle=`rgba(139,92,246,${1-dist/130})`;

ctx.stroke();

}

}

}

requestAnimationFrame(animate);

}

animate();

}

/*==========================================
FLOATING ICONS PARALLAX
==========================================*/

const floatingIcons = document.querySelectorAll(".floating-icons i");

window.addEventListener("mousemove",(e)=>{

const x=(window.innerWidth/2-e.clientX)/80;

const y=(window.innerHeight/2-e.clientY)/80;

floatingIcons.forEach(icon=>{

icon.style.transform=`translate(${x}px,${y}px)`;

});

});

/*==========================================
PROJECT HOVER
==========================================*/

document.querySelectorAll(".project-card")

.forEach(card=>{

card.addEventListener("mouseenter",()=>{

card.style.transition=".4s";

card.style.boxShadow=

"0 25px 60px rgba(139,92,246,.35)";

});

card.addEventListener("mouseleave",()=>{

card.style.boxShadow="";

});

});

/*==========================================
SECTION ANIMATION
==========================================*/

const premiumSections=document.querySelectorAll("section");

const premiumObserver=new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.animate([

{

opacity:0,

transform:"translateY(60px)"

},

{

opacity:1,

transform:"translateY(0)"

}

],{

duration:900,

fill:"forwards",

easing:"ease"

});

}

});

});

premiumSections.forEach(section=>{

premiumObserver.observe(section);

});

/*==========================================
NEON HOVER
==========================================*/

const neon=document.querySelector(".neon-name");

if(neon){

neon.addEventListener("mouseenter",()=>{

neon.style.transform="scale(1.05)";

});

neon.addEventListener("mouseleave",()=>{

neon.style.transform="scale(1)";

});

}

/*==========================================
PREMIUM VERSION
==========================================*/

console.log("%cPortfolio Premium v3",
"color:#8B5CF6;font-size:22px;font-weight:bold;");

console.log("Created by Marcellino with HTML CSS JavaScript");

/*==========================================
EDUCATION POPUP
==========================================*/

const educationData = [
{
title:"SMK Krian 1 Sidoarjo",
image:"foto/smk.jpg",
description:"SMK Krian 1 Sidoarjo merupakan sekolah kejuruan yang memiliki berbagai program keahlian, salah satunya Rekayasa Perangkat Lunak (RPL). Di sekolah ini saya mempelajari HTML, CSS, JavaScript, PHP, MySQL, pembuatan website, UI/UX, serta berbagai proyek berbasis web."
},

{
title:"SMP Negeri 1 Prambon",
image:"foto/smp.jpg",
description:"Selama bersekolah di SMP Negeri 1 Prambon saya mulai mengenal dunia komputer dan teknologi. Dari sinilah muncul minat saya untuk menjadi seorang programmer dan melanjutkan pendidikan ke jurusan Rekayasa Perangkat Lunak."
},

{
title:"SD Negeri Kedung Wonokerto",
image:"foto/sd.jpeg",
description:"Di SD Negeri Kedung Wonokerto saya mulai tertarik dengan teknologi dan komputer. Ketertarikan tersebut menjadi awal perjalanan saya untuk belajar di bidang IT hingga sekarang."
}
];

const timelineItems = document.querySelectorAll(".timeline-item");

const popup = document.getElementById("educationPopup");
const popupImage = document.getElementById("popupImage");
const popupTitle = document.getElementById("popupTitle");
const popupDescription = document.getElementById("popupDescription");
const closePopup = document.getElementById("closeEducation");

timelineItems.forEach((item,index)=>{

item.style.cursor="pointer";

item.addEventListener("click",()=>{

popup.classList.add("active");

popupImage.src = educationData[index].image;
popupTitle.innerText = educationData[index].title;
popupDescription.innerText = educationData[index].description;

});

});

closePopup.addEventListener("click",()=>{

popup.classList.remove("active");

});

popup.addEventListener("click",(e)=>{

if(e.target===popup){

popup.classList.remove("active");

}

});

/*==========================================
EXPERIENCE POPUP
==========================================*/

const experienceCard = document.getElementById("experienceCard");

experienceCard.addEventListener("click", () => {

    popup.classList.add("active");

    popupImage.src = "foto/cnc.png"; // ganti sesuai nama file

    popupTitle.innerText = "PT CNC Disain Nusantara";

    popupDescription.innerText =
    "PT CNC Disain Nusantara merupakan perusahaan yang bergerak di bidang Industrial Automation dan Authorized Solution Partner Siemens. Selama PKL saya mengerjakan pembuatan Website Responsive, Landing Page, Dashboard, UI Modern, serta membantu berbagai pekerjaan berbasis web dan teknologi industri.";

});

/*==========================================
MOUSE GLASS EFFECT
==========================================*/

const premiumCards = document.querySelectorAll(
".timeline-item,.skill-card,.project-card,.experience-box,.contact-box"
);

premiumCards.forEach(card=>{

card.addEventListener("mousemove",(e)=>{

const rect = card.getBoundingClientRect();

const x = e.clientX - rect.left;
const y = e.clientY - rect.top;

card.style.setProperty("--x",x+"px");
card.style.setProperty("--y",y+"px");

});

});

const projectData = [
{
    title: "Website Portfolio",
    image: "project/portopolio.jpeg",
    description: "Website portfolio modern yang dibuat menggunakan HTML, CSS, dan JavaScript."
},
{
    title: "Web Report Industri",
    image: "project/web industri.jpg",
    description: "Website Before & After Service untuk mendokumentasikan kondisi mesin."
},
{
    title: "Desain Grafis Industri",
    image: "project/Desain Grafis.jpg",
    description: "Desain grafis untuk kebutuhan promosi dan branding perusahaan."
}
];

const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach((card,index)=>{

    card.style.cursor = "pointer";

    card.addEventListener("click",()=>{

        popup.classList.add("active");

        popupImage.src = projectData[index].image;
        popupTitle.innerText = projectData[index].title;
        popupDescription.innerText = projectData[index].description;

    });

});

