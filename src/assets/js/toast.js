var toast = {
  count: 0,
  createToast(msg, type = true) {
    toast.count += 1;
    var newToast = document.createElement("div");
    newToast.classList.add("toast");
    if (!type) newToast.classList.add("toast-error");
    newToast.classList.add("up");
    newToast.setAttribute("id", "toast" + toast.count);

    var textArea = document.createElement("p");
    textArea.innerHTML = msg;
    newToast.appendChild(textArea);

    var iconArea = document.createElement("svg");
    if (type) {
      iconArea.innerHTML = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 511.999 511.999" style="enable-background:new 0 0 511.999 511.999;" xml:space="preserve"><g><g><path d="M500.698,115.164L464.903,79.37c-15.34-15.341-40.908-15.341-56.248,0L210.932,278.798L103.548,171.413
       c-15.341-15.34-40.908-15.34-56.248,0l-35.794,35.794c-15.34,15.34-15.34,40.908,0,56.249l168.746,168.746
       c6.818,6.818,17.045,11.932,28.976,11.932h1.705c10.227,0,20.454-3.409,27.272-11.932l260.789-260.79
       C516.038,156.072,516.038,130.505,500.698,115.164z M476.835,147.55l-260.79,260.789c-1.705,1.705-3.409,1.705-3.409,1.705h-1.705
       c-1.705,0-3.409,0-3.409-1.705L38.776,239.594c-3.409-3.409-3.409-6.818-1.705-8.523l35.794-35.794
       c1.704-1.705,3.409-1.705,3.409-1.705s3.409,0,3.409,1.705l119.315,119.315c6.818,6.818,17.045,6.818,23.863,0l211.359-211.359
       c3.409-3.409,5.113-3.409,8.523,0l35.795,35.794C478.539,140.732,478.539,144.141,476.835,147.55z"/></g></g></svg>`;
    }
    else {
      iconArea.innerHTML = `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve"><g><g><path d="M503.839,395.379l-195.7-338.962C297.257,37.569,277.766,26.315,256,26.315c-21.765,0-41.257,11.254-52.139,30.102
         L8.162,395.378c-10.883,18.85-10.883,41.356,0,60.205c10.883,18.849,30.373,30.102,52.139,30.102h391.398
         c21.765,0,41.256-11.254,52.14-30.101C514.722,436.734,514.722,414.228,503.839,395.379z M477.861,440.586
         c-5.461,9.458-15.241,15.104-26.162,15.104H60.301c-10.922,0-20.702-5.646-26.162-15.104c-5.46-9.458-5.46-20.75,0-30.208
         L229.84,71.416c5.46-9.458,15.24-15.104,26.161-15.104c10.92,0,20.701,5.646,26.161,15.104l195.7,338.962
         C483.321,419.836,483.321,431.128,477.861,440.586z"/></g></g><g><g><rect x="241.001" y="176.01" width="29.996" height="149.982"/></g></g><g><g><path d="M256,355.99c-11.027,0-19.998,8.971-19.998,19.998s8.971,19.998,19.998,19.998c11.026,0,19.998-8.971,19.998-19.998
         S267.027,355.99,256,355.99z"/></g></g></svg>`
    }
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