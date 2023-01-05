// Comment List slider carousel
let comment_slider = document.querySelector("#comment-list-slider");
let comment_prev_control = document.querySelector(".comment-list-slider-control #prev-one");
let comment_next_control = document.querySelector(".comment-list-slider-control #next-one");

if(comment_slider.scrollLeft == 0){
    comment_prev_control.style.visibility = 'hidden';
}

comment_slider.addEventListener('scroll',function(e){
    let a = this.scrollLeft;
    let b = this.scrollWidth - this.clientWidth;
    let c = a/b;
    if(c == 1){
        comment_next_control.style.visibility = 'hidden';
    }else if(c == 0){
        comment_prev_control.style.visibility = 'hidden';
    }else{
        comment_next_control.style.visibility = 'visible';
        comment_prev_control.style.visibility = 'visible';
    }
})

comment_next_control.addEventListener('click', function (e) {
    e.preventDefault();
    comment_slider.scrollLeft += 200
})
comment_prev_control.addEventListener('click', function (e) {
    e.preventDefault();
    comment_slider.scrollLeft -= 200
})

// Ranking list 
let ranking_slider = document.querySelector("#ranking-list-slider");
let ranking_prev_control = document.querySelector(".ranking-list-slider-control #prev-one");
let ranking_next_control = document.querySelector(".ranking-list-slider-control #next-one");

if(ranking_slider.scrollLeft == 0){
    ranking_prev_control.style.visibility = 'hidden';
}

ranking_slider.addEventListener('scroll',function(e){
    let a = this.scrollLeft;
    let b = this.scrollWidth - this.clientWidth;
    let c = a/b;
    if(c == 1){
        ranking_next_control.style.visibility = 'hidden';
    }else if(c == 0){
        ranking_prev_control.style.visibility = 'hidden';
    }else{
        ranking_next_control.style.visibility = 'visible';
        ranking_prev_control.style.visibility = 'visible';
    }
})

ranking_next_control.addEventListener('click', function (e) {
    e.preventDefault();
    ranking_slider.scrollLeft += 200
})
ranking_prev_control.addEventListener('click', function (e) {
    e.preventDefault();
    ranking_slider.scrollLeft -= 200
})

// Recommend Slider

let recommend_slider = document.querySelector('.recommend-list-slider');

setInterval(() => {
    recommend_slider.scrollLeft += 200
}, 4000);