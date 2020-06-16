var toast = {
  count: 0,
  createToast(msg) {
    toast.count += 1;
    var newToast = document.createElement("div");
    newToast.classList.add("toast");
    newToast.classList.add("up");
    newToast.setAttribute("id", "toast" + toast.count);

    var textArea = document.createElement("p");
    textArea.innerHTML = msg;
    newToast.appendChild(textArea);

    var iconArea = document.createElement("svg");
    iconArea.innerHTML = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 511.999 511.999" style="enable-background:new 0 0 511.999 511.999;" xml:space="preserve"><g><g>
     <path d="M500.698,115.164L464.903,79.37c-15.34-15.341-40.908-15.341-56.248,0L210.932,278.798L103.548,171.413
       c-15.341-15.34-40.908-15.34-56.248,0l-35.794,35.794c-15.34,15.34-15.34,40.908,0,56.249l168.746,168.746
       c6.818,6.818,17.045,11.932,28.976,11.932h1.705c10.227,0,20.454-3.409,27.272-11.932l260.789-260.79
       C516.038,156.072,516.038,130.505,500.698,115.164z M476.835,147.55l-260.79,260.789c-1.705,1.705-3.409,1.705-3.409,1.705h-1.705
       c-1.705,0-3.409,0-3.409-1.705L38.776,239.594c-3.409-3.409-3.409-6.818-1.705-8.523l35.794-35.794
       c1.704-1.705,3.409-1.705,3.409-1.705s3.409,0,3.409,1.705l119.315,119.315c6.818,6.818,17.045,6.818,23.863,0l211.359-211.359
       c3.409-3.409,5.113-3.409,8.523,0l35.795,35.794C478.539,140.732,478.539,144.141,476.835,147.55z"/>
   </g></g></svg>`;
    newToast.appendChild(iconArea);

    var toastZone = document.getElementById("toastzone");
    toastZone.appendChild(newToast);

    var todelete = toast.count;
    setTimeout(() => {
      var toast = document.getElementById("toast" + todelete);
      toast.classList.add("toastClose");
      setTimeout(function () {
        toast.style.display = "none";
        toast.remove();
      }, 500);
    }, 4000);
  }
}

export default toast