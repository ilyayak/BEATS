const menuOpenBurger = (function (buttonClass, menuClass, lineClass) {
  const button = document.querySelector(buttonClass);
  const menu = document.querySelector(menuClass);
  const line = document.querySelector(lineClass);
  const body = document.querySelector('body');

  const toggleMenu = function () {
    button.classList.toggle('hamburger_active');
    menu.classList.toggle('overlay_open');
    body.classList.toggle('body-active_menu');
    line.classList.toggle('top-line_active');
  }

  const addListeners = function () {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      toggleMenu();
    });
    menu.addEventListener('click', function (e) {
      e.preventDefault();
      if (e.target.classList.contains('overlay-menu__link')) {
        toggleMenu();
      }
    })
  };
  return {
    open: addListeners,
  };

})('#toggle', '#overlay', '#line');

console.log(menuOpenBurger);
menuOpenBurger.open();

const findBlockByAlias = (alias) => {
  return $(".review__item").filter((ndx, item) => {
    return $(item).attr("data-linked-with") === alias;
  });
};



// slideshow(reviews)



$(".reviews-switcher__link").click((e) => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const target = $this.attr("data-open");
  const itemToShow = findBlockByAlias(target);
  const curItem = $this.closest(".reviews-switcher__item");

  itemToShow.addClass("active").siblings().removeClass("active");
  curItem.addClass("active").siblings().removeClass("active");

});

// accordeon(team)

const openItem = item => {
  const container = item.closest(".team__item");
  const contentBlock = container.find(".team__content");
  const textBlock = contentBlock.find(".team__content-block");
  const reqHeight = textBlock.height();

  container.addClass("active");
  contentBlock.height(reqHeight);
}

const closeEveryItem = container => {
  const items = container.find(".team__content");
  const itemContainer = container.find(".team__item");

  itemContainer.removeClass("active");
  items.height(0);
}

$(".team__title").click((e) => {
  const $this = $(e.currentTarget);
  const container = $this.closest(".team");
  const elemContainer = $this.closest(".team__item");


  if (elemContainer.hasClass("active")) {
    closeEveryItem(container);
  } else {
    closeEveryItem(container);
    openItem($this);
  };


});


// carousel bxslider


const slider = $('.carousel__list').bxSlider({
  pager: false,
  controls: false
});

$('.carousel__btn_left').click(e => {
  e.preventDefault();
  slider.goToPrevSlide();
})

$('.carousel__btn_right').click(e => {
  e.preventDefault();
  slider.goToNextSlide();
});

// closing of modal window + .ajax sending of form content + validation of empty symbols in the input

const validateFields = (form, fieldsArray) => {

  fieldsArray.forEach((field) => {
    field.removeClass("input-error");
    if (field.val().trim() === "") {
      field.addClass("input-error");
    }
  });

  const errorFields = form.find(".input-error");
  return errorFields.length === 0;

}

$('.form').submit(e => {
  e.preventDefault();

  const form = $(e.currentTarget);
  const name = form.find("[name='name']");
  const phone = form.find("[name='phone']");
  const comment = form.find("[name='comment']");
  const to = form.find("[name='to']");

  const modal = $("#modal");
  const content = modal.find(".modal__content");

  modal.removeClass("error-modal");

  const isValid = validateFields(form, [name, phone, comment, to]);

  if (isValid) {
    const request = $.ajax({
      url: "https://webdev-api.loftschool.com/sendmail",
      method: "post",
      data: {
        name: name.val(),
        phone: phone.val(),
        comment: comment.val(),
        to: to.val(),
      },
      error: (data) => { },

    });

    request.done((data) => {
      content.text(data.message);
    });

    request.fail((data) => {
      modal.addClass("error-modal");
      const message = data.responseJSON.message;
      content.text(message);
      console.log(data);
      
    });
    request.always(() => {
      $.fancybox.open({
        src: "#modal",
        type: "inline",
      });

    });
  }
});

$(".app-submit-btn").click(e => {
  e.preventDefault();

  $.fancybox.close();
});


let player;
 
function onYouTubeIframeAPIReady() {
 player = new YT.Player("yt-player", {
   height: "402",
   width: "1035",
   videoId: "LXb3EKWsInQ",
   events: {
    //  onReady: onPlayerReady,
    //  onStateChange: onPlayerStateChange
   },
   playerVars: {
     controls:0,
     disablekb: 0,
     showinfo: 0,
     rel: 0,
     autoplay: 0,
     modestbranding: 0

   },
 });
};

let myMap;

const init = () => {
  myMap = new ymaps.Map("map",{
    center: [55.751999,37.576133],
    zoom:13,
    controls:[]
  })

  const coords = [
    [55.747407,37.597446],
    [55.739015,37.610838],
    [55.766447,37.579564],
    [55.752739,37.622409]
  ];
  const myCollection = new ymaps.GeoObjectCollection({}, {
    draggable: false, 
    iconLayout: 'default#image',
    iconImageHref:"./img/decor/mapmarker.png",
    iconImageSize: [38, 50],
    iconImageOffset: [-3, -42]
  });


  coords.forEach((coord) =>  {
    myCollection.add(new ymaps.Placemark(coord));
  });

  myMap.geoObjects.add(myCollection);

  myMap.behaviors.disable('scrollZoom');
}

ymaps.ready(init);

jQuery(document).ready(function () {
  $('.slider').bxSlider();
  onYouTubeIframeAPIReady();
  validateFields();
});

