import Swal from "sweetalert2";

const successAlert = (content) => {
    Swal.fire({
        position: "center-center",
        icon: "success",
        title: content,
        showConfirmButton: false,
        timer: 1500
      });
}

const errorAlert = (content) => {
    Swal.fire({
        position: "center-center",
        icon: "error",
        title: content,
        showConfirmButton: false,
        timer: 1500
      });
}

const warningAlert = (content) => {
    Swal.fire({
        position: "center-center",
        icon: "warning",
        title: content,
        showConfirmButton: false,
        timer: 1500
      });
}

const processAlert = (title, content) => {
    let timerInterval;
    Swal.fire({
        title: title,
        html: content + " <b></b> milliseconds.",
        timer: 1000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
          const timer = Swal.getPopup().querySelector("b");
          timerInterval = setInterval(() => {
            timer.textContent = `${Swal.getTimerLeft()}`;
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        }
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log("I was closed by the timer");
        }
      });
}

const submitAlert = (success, fucn) => {
  Swal.fire({
    title: "PAY ORDER RESUL",
    text: success ? "Transaction with VNPay successful" : "Transaction failed, please try again later",
    icon: success ? "success" : "error",
    allowOutsideClick: false 
  }).then((result) => {
    if (result.isConfirmed) {
      fucn()
    }
  });
}

export { errorAlert, processAlert, submitAlert, successAlert, warningAlert };

