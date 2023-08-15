/*==============================================================*/
// Raque Contact Form  JS
/*==============================================================*/
(function ($) {
    "use strict"; // Start of use strict
    
    $("#contactForm").validator().on("submit", function (event) {
        if (event.isDefaultPrevented()) {
            // handle the invalid form...
            console.log("error 1");
            formError();
            submitMSG(false, "Did you fill in the form properly?");
            
        } else {
            // everything looks good!
            event.preventDefault();
            submitForm();
        }
    });


    function submitForm(){
        // Initiate Variables With Form Content
        var name = $("#name").val();
        var email = $("#email").val();

        var msg_subject = $("#subject").val();
        var phone_number = $("#phone").val();
        var message = $("#description").val();

      
        // console.log(name + " what is this???");
        if (!name || !email || !msg_subject || !phone_number || !message) {
            console.log("error 2");
            formError();
            submitMSG(false, "Please fill all fields");
                return;
        }

        const url = "https://simonainc.com/app/send-mail"; // replace with your endpoint URL

        const data = {
            name: name,
            email: email,
            subject: msg_subject,
            description: message,
            phone: phone_number
          };

        const params = new URLSearchParams(data).toString();

        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        }).then((response)=>{
            if(response.ok){
                formSuccess();
                myFunctionSuccess();
            }else{
                formError();
                myFunctionError()
                submitMSG(false, "Something bad happened, please check everything and try again");
            }
        }).catch((err) => {
                    formError();
                    submitMSG(false,err.message);
        });
        
        // $.ajax({
        //     type: "POST",
        //     url: "app/send-mail",
        //     data: "name=" + name + "&email=" + email + "&subject=" + msg_subject + "&phone=" + phone_number + "&description=" + message,
        //     success : function(text){
        //         if (text == "success"){
        //             formSuccess();
        //         } else {
        //             formError();
        //             submitMSG(false,text);
        //         }
        //     }
        // });
    }

    function myFunctionSuccess() {
        var x = document.getElementById("snackbar");
      
        x.className = "show";
      
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
      }
    function myFunctionError() {
        var x = document.getElementById("snackbarerr");
      
        x.className = "show";
      
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
      }

    function formSuccess(){
        $("#contactForm")[0].reset();
        submitMSG(true, "Message Submitted!")
    }

    function formError(){
        $("#contactForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass();
        });
    }

    function submitMSG(valid, msg){
        if(valid){
            var msgClasses = "h4 tada animated text-success";
        } else {
            var msgClasses = "h4 text-danger";
        }
        $("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
    }
}(jQuery)); // End of use strict