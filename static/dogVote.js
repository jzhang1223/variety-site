window.onload = setup

function setup() {
  document.getElementById("card1-image").addEventListener("click", get_dogs);
  document.getElementById("card2-image").addEventListener("click", get_dogs);
  get_dogs();
}

function get_dogs() {
  fetch_dog("card1-image");
  fetch_dog("card2-image");
}

async function fetch_dog(element_id) {
  const accepted_files = ["PNG", "png", "jfif", "jpeg", "JPG", "jpg", "gif"]
  // const declined_files = ["mp4", "webm"]
  let include_query = accepted_files.join(",");
  let get_dog_url = `https://random.dog/woof.json?include=${include_query}`;

  fetch(get_dog_url)
    .then(response => response.json())
    .then(data => data.url)
    .then(dog_url => set_image(dog_url, element_id));
}

function set_image(dog_url, element_id) {
  var card_image = document.getElementById(element_id);
  card_image.src = dog_url;
  // image = new Image();
  // image.src = dog_url;
  // image.addEventListener("onload", (dog_url) => { card_image.src = dog_url; })
}