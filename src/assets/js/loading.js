var loading = {
  switch(target) {
    var loadingzone = document.getElementById("loadingzone");

    if (target) {
      if (loadingzone.classList.contains("hidden")) {
        loadingzone.classList.remove("hidden");
        return
      }
    } else {
      if (loadingzone.classList.contains("hidden")) {
        return
      }
      loadingzone.classList.add("hidden");
    }
  }
}

export default loading