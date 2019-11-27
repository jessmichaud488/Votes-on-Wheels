var quoteIndex = -1;


$(document).ready(function() {
 let API_URL = 'https://secure-brushlands-88020.herokuapp.com/';
    //LOGIN SECTION
    const loginDbCallMethods = { 
        loginCredentials: {},
        getLoginValues: function(){
            this.loginCredentials.username = $('input[name="username"]').val();
            this.loginCredentials.password = $('input[name="password"]').val();
            this.checkIfValueMissing(this.loginCredentials);
        },
        checkIfValueMissing: function(credentials){
            var myThis = this;
            if(credentials.username === "" || credentials.password === ""){
                $('.incorrect-credentials').css('display', 'block');
                $('.incorrect-credentials-card').text('Please fill out all the fields.');
                $('.incorrect-credentials button').css('display', 'inline-block');
            }
            else{
              console.log("credentials - ", credentials);
                myThis.checkUsernameInDb(credentials);
            }
        },

        checkUsernameInDb: function(obj){
            var myThis = this;
            $.ajax({
                method: 'POST',
                url: `${API_URL}/auth/login`,
                data: JSON.stringify(obj),
                //data: {username:obj.userName, password:obj.password},

                contentType: 'application/json; charset=utf-8'
            })
            .done(function(data){
                if(typeof(data) === 'string'){
                    $('.incorrect-credentials').css('display', 'block');
                    $('.incorrect-credentials-card p').text('Invalid credentials. Please try again.');
                    $('.incorrect-credentials button').css('display', 'inline-block');
                }
                else{
                    localStorage.setItem("authToken", data.authToken);
                    localStorage.setItem("driver", data.driver);
                    localStorage.setItem("userId", data.userId);
                    if (data.driver){
                    myThis.launchDriverDashboard(data.userId);
                    }
                    else {
                    myThis.launchVoterDashboard(data.userId);
                    }
                }
            });
        },
        launchDriverDashboard: function(id){
            $('.loading-credentials').css('display', 'block');
            $('.loading-credentials button').css('display', 'none');
            $('.loading-credentials-card p').text(quotesCard());
            $('.loading-credentials-card span').css('display', 'block');
            $('input[name="username"]').val("");
            $('input[name="password"]').val("");
            setTimeout(`window.location.href = "driver/driverdashboard.html?id=${id}"`, 3000);
        },
        launchVoterDashboard: function(id){
            $('.loading-credentials').css('display', 'block');
            $('.loading-credentials button').css('display', 'none');
            $('.loading-credentials-card p').text(quotesCard());
            $('.loading-credentials-card span').css('display', 'block');
            $('input[name="username"]').val("");
            $('input[name="password"]').val("");
            setTimeout(`window.location.href = "voter/voterdashboard.html?id=${id}"`, 3000);
        }
    };
  
  function quotesCard() {

    var quotes = $(".quotes");

    function showNextQuote() {
        quoteIndex+=1;
        quotes.eq(quoteIndex % quotes.length)
            .fadeIn(3000)
            .delay(3000)
            .fadeOut(3000, showNextQuote);
    }

    showNextQuote();

};

    //REGISTER DRIVER SECTION
    const driverDbCallMethods = {
        newDriverData: {},
        driverRegisterClicked: function(){
            this.newDriverData.firstName = $('.driver-register input[name="first-name"]').val();
            this.newDriverData.lastName = $('.driver-register input[name="last-name"]').val();
            this.newDriverData.phone = $('.driver-register input[name="phone"]').val();
            this.newDriverData.email = $('.driver-register input[name="email"]').val();
            this.newDriverData.street = $('.driver-register input[name="street"]').val();
            this.newDriverData.city = $('.driver-register input[name="city"]').val();
            this.newDriverData.state = $('.driver-register input[name="state"]').val();
            this.newDriverData.zip = $('.driver-register input[name="zip"]').val();
            this.newDriverData.userName = $('.driver-register input[name="username"]').val();
            this.newDriverData.password = $('.driver-register input[name="password"]').val();
            this.checkIfDriverValueMissing(this.newDriverData);
        },
      
        checkIfDriverValueMissing: function(driverObj){
            for(let prop in driverObj){
                if(driverObj[prop] === ""){
                    return this.showMissingDriverValuesModal();
                }   
            }
            this.addNewDriverToDb(driverObj);
        },
      
        showMissingDriverValuesModal: function(){
            var myThis = this;
            $('.missing-values').css('display', 'block');
            $('.missing-values p').text('Please fill out all the fields.');
            $('.missing-values button').css('display', 'inline-block');
            $('.missing-values button').on('click', function(event){
                event.stopPropagation();
                event.preventDefault();
                $('.missing-values').css('display', 'none');
            });
        },
      
        addNewDriverToDb: function(driverObj){
          console.log("New Driver router")
            var myThis = this;
            $.ajax({
                method: 'POST',
                url: `${API_URL}/driver`,
                data: JSON.stringify({
                    userFullName: {
                        firstName: driverObj.firstName,
                        lastName: driverObj.lastName
                    },
                    phoneNumber: driverObj.phone,
                    address: {
                        street: driverObj.street,
                        city: driverObj.city,
                        state: driverObj.state,
                        zipcode: driverObj.zip
                    },
                    email: driverObj.email,
                    userName: driverObj.userName,
                    password: driverObj.password,
                    isActive: true,
                    isDriver: true
                }),
                contentType: 'application/json; charset=utf-8'
            })
               .done(function(payload){
                    console.log("Client side payload = ", payload)
                    myThis.showRedirectMessage(payload.userFullName.firstName);
                    setTimeout(id => {location.href = `driver/driverdashboard.html?id=${payload._id}`}, 1000, payload._id);
                    clickEvents.closeRegisterModal;
                    //setTimeout(id => {location.href = `#${id}`}, 3000, payload._id);
                    //setTimeout(`window.location.href = "driver/driverdashboard.html?id=${payload._id}"`, 3000);
                });
            },
      
        showFrequencyModal: function(driverObj){
            var myThis = this;
            $('.frequency-wrapper').css('display', 'block');
            $('.register-wrapper').css('display', 'none');
            $('.add-frequency button').on('click', function(event){
                event.stopPropagation();
                event.preventDefault();
                myThis.storeFrequencyValues(driverObj);
            });
        },
      
        storeFrequencyValues: function(driverObj){
            let frequencySched = {
                time: {
                    hour: parseInt($("input[name=appt-time]").val().slice(0,2)),
                    minutes: parseInt($("input[name=appt-time]").val().slice(3))
                }
            };
            this.addFrequencyToDb(driverObj, frequencySched);
        },
      
        addFrequencyToDb(driverObj, schedObj){
            var myThis = this;
            if($('input[name="start-date"]').val() && $('input[name="end-date"]').val() && $('input[name="appt-time"]').val() && ($('input[name="monday"]').is(':checked') || $('input[name="tuesday"]').is(':checked') || $('input[name="wednesday"]').is(':checked') || $('input[name="thursday"]').is(':checked') || $('input[name="friday"]').is(':checked') || $('input[name="saturday"]').is(':checked') || $('input[name="sunday"]').is(':checked'))){
                $.ajax({
                    method: 'POST',
                    url: `${API_URL}/driver/${driverObj._id}/schedules`,
                    data: JSON.stringify({
                        schedType: schedObj.schedType,
                        startingDate: schedObj.startingDate,
                        endingDate: schedObj.endingDate,
                        dayOfWeek: schedObj.dayOfWeek,
                        time: schedObj.time,
                        driverId: driverObj._id,
                        driverName: driverObj.driver.firstName + driverObj.driver.lastName,
                        bookings: []
                    }),
                    contentType: 'application/json; charset=utf-8'
                })
                .done(function(payload){
                let driverProfile = payload;
                myThis.showFrequencyModal(driverProfile);
            });
        }
            else{
                myThis.showMissingDriverValuesModal();
            }
        },
      
        showRedirectMessage: function(driverName){
            $('.redirect-message').css('display', 'block');
            $('.redirect-message p').text(`Welcome, ${driverName}! One moment while I load your dashboard.`);
        },
    }

    //REGISTER VOTER SECTION
    const voterDbCallMethods = {
        newvoterData: {},
        voterRegisterClicked: function(){
            this.newvoterData.firstName = $('.voter-register input[name="first-name"]').val();
            this.newvoterData.lastName = $('.voter-register input[name="last-name"]').val();
            this.newvoterData.phone = $('.voter-register input[name="phone"]').val();
            this.newvoterData.email = $('.voter-register input[name="email"]').val();
            this.newvoterData.street = $('.voter-register input[name="street"]').val();
            this.newvoterData.city = $('.voter-register input[name="city"]').val();
            this.newvoterData.state = $('.voter-register input[name="state"]').val();
            this.newvoterData.zip = $('.voter-register input[name="zip"]').val();
            this.newvoterData.userName = $('.voter-register input[name="username"]').val();
            this.newvoterData.password = $('.voter-register input[name="password"]').val();
            this.checkIfVoterValueMissing(this.newvoterData);
        },
      
        checkIfVoterValueMissing: function(voterObj){
            for(let prop in voterObj){
                if(voterObj[prop] === ""){
                    return this.showMissingVoterValuesModal();
                }   
            }
            this.addNewVoterToDb(voterObj);
        },
      
        showMissingVoterValuesModal: function(){
            var myThis = this;
            $('.missing-values').css('display', 'block');
            $('.missing-values p').text('Please fill out all the fields.');
            $('.missing-values button').css('display', 'inline-block');
            $('.missing-values button').on('click', function(event){
                event.stopPropagation();
                event.preventDefault();
                $('.missing-values').css('display', 'none');
            });
        },
      
        addNewVoterToDb: function(voterObj){
            var myThis = this;
            $.ajax({
                method: 'POST',
                url: `${API_URL}/voter`,
                data: JSON.stringify({
                    userFullName: {
                        firstName: voterObj.firstName,
                        lastName: voterObj.lastName
                    },
                    phoneNumber: voterObj.phone,
                    address: {
                        street: voterObj.street,
                        city: voterObj.city,
                        state: voterObj.state,
                        zipcode: voterObj.zip
                    },
                    email: voterObj.email,
                    userName: voterObj.userName,
                    password: voterObj.password,
                    isActive: true,
                    isVoter: true,
                }),
              
                contentType: 'application/json; charset=utf-8'
            })
                .done(function(payload){
                    console.log("Client side payload = ", payload)
                    myThis.showRedirectMessage(payload.userFullName.firstName);
                    setTimeout(id => {location.href = `../voter/voterdashboard.html?id=${payload._id}`}, 1000, payload._id);
                    clickEvents.closeRegisterModal;
                    //setTimeout(id => {location.href = `#${id}`}, 3000, payload._id);
                    //setTimeout(`window.location.href = "driver/driverdashboard.html?id=${payload._id}"`, 3000);
            });
        },
      
        showRedirectMessage: function(voterName){
                $('.redirect-message').css('display', 'block');
                $('.redirect-message p').text(`Welcome, ${voterName}! One moment while I load your dashboard.`);
            }
    };
  

    //----------CLICK FUNCTIONS------------//
    const clickEvents = {
        closeHamburgerMenu: function(){
            setTimeout(function(){
                    $('.hamburger-menu').css('display', 'none');
                }, 1000);
            $('.hamburger-menu').removeClass('fadeInRight').addClass('fadeOutRight');
        },

        logoclick: function(){
            $('html, body').animate({scrollTop: 0}, 1000);
        },

        showHamburgerMenu: function(){
            $('.hamburger-menu').removeClass('fadeOutRight').css('display', 'block').addClass('fadeInRight');
            
        },

        resetLoginInputs: function(){
            $('#login input[name="username"]').val("");
            $('#login input[name="password"]').val("");
        },

        showLoginModal: function(){
            $('#login').removeClass('fadeOutDown').css('display', 'block').addClass('fadeInDown');
        },

        closeLoginModal: function(){
            this.resetLoginInputs();
            setTimeout(function(){
                    $('#login').css('display', 'none');
                }, 1000);
            $('#login').removeClass('fadeInDown').addClass('fadeOutDown');
        },
      
        resetForgotPasswordInputs: function(){
            $('#forgot input[name="username"]').val("");
            $('#forgot input[name="password"]').val("");
        },

        showForgotPasswordModal: function(){
            $('#forgot').removeClass('fadeOutDown').css('display', 'block').addClass('fadeInDown');
        },

        closeForgotPasswordModal: function(){
            this.resetForgotPasswordInputs();
            setTimeout(function(){
                    $('#forgot').css('display', 'none');
                }, 1000);
            $('#forgot').removeClass('fadeInDown').addClass('fadeOutDown');
        },
      
        showRegisterModal: function(){
            $('#register').removeClass('fadeOutDown').css('display', 'block').addClass('fadeInDown');
        },
        closeRegisterModal: function(){
            setTimeout(function(){
                    $('#register').css('display', 'none');
            }, 1000);
            $('#register').removeClass('fadeInDown').addClass('fadeOutDown');
        },

        showRegisterTypesModal: function(){
            $('.register-types').css('display', 'block');
        },

        closeRegisterTypesModal: function(){
            $('.register-types').css('display', 'none');
        },

        showDriverRegisterModal: function(){
            $('.driver-register').css('display', 'block');
        },

        closeDriverRegisterModal: function(){
            $('.driver-register').css('display', 'none');
        },

        showVoterRegisterModal: function(){
            $('.voter-register').css('display', 'block');
        },

        closeVoterRegisterModal: function(){
            $('.voter-register').css('display', 'none');
        },

        goToHowTo: function(){
            this.closeHamburgerMenu();
            $('html, body').animate({scrollTop: $('#howto').offset().top}, 1000);
        },

        goToContact: function(){
            this.closeHamburgerMenu();
            $('html, body').animate({scrollTop: $('#contact').offset().top}, 1000);
        },
      
        closeIncorrectCredentialsModal: function(){
            $('.incorrect-credentials').css('display', 'none');
            $('input[name="username"]').val("");
            $('input[name="password"]').val("");
        },

        closeMissingValuesModal: function(){
            $('.missing-values').css('display', 'none');
        },
      
      closeLoadingCredentialsModal: function(){
            $('.loading-credentials').css('display', 'none');
            $('input[name="username"]').val("");
            $('input[name="password"]').val("");
        },

        resetVoterForm: function(){
            $('.voter-register input[name="first-name"]').val("");
            $('.voter-register input[name="last-name"]').val("");
            $('.voter-register textarea').val("");
            $('.voter-register input[name="phone"]').val("");
            $('.voter-register input[name="email"]').val("");
            $('.voter-register input[name="street"]').val("");
            $('.voter-register input[name="city"]').val("");
            $('.voter-register input[name="state"]').val("");
            $('.voter-register input[name="zip"]').val("");
            $('.voter-register input[name="username"]').val("");
            $('.voter-register input[name="password"]').val("");
        },

        resetDriverForm: function(){
            $('.driver-register input[name="first-name"]').val("");
            $('.driver-register input[name="last-name"]').val("");
            $('.driver-register input[name="phone"]').val("");
            $('.driver-register input[name="email"]').val("");
            $('.driver-register input[name="street"]').val("");
            $('.driver-register input[name="city"]').val("");
            $('.driver-register input[name="state"]').val("");
            $('.driver-register input[name="zip"]').val("");
            $('.driver-register input[name="username"]').val("");
            $('.driver-register input[name="password"]').val("");
        },

      resetForgotPasswordForm: function(){
            $('#forgot input[name="email"]').val("");
        },
      
        showDemoTypes: function(){
            $('.demo-types-wrapper').removeClass('fadeOutDown').css('display', 'block').addClass('fadeInDown');
        },
        
        closeDemoTypes: function(){
            setTimeout(function(){
                    $('.demo-types-wrapper').css('display', 'none');
            }, 1000);
            $('.demo-types-wrapper').removeClass('fadeInDown').addClass('fadeOutDown');
        }
    };


    //-------AJAX Event Listeners--------------//
    //demo driver
    $('.driver-demo').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        clickEvents.closeDemoTypes();
        $('.login-wrapper').css('display', 'none');
        clickEvents.showLoginModal();
        loginDbCallMethods.launchDriverDashboard("5a60734f3160e79360110d6b");
    });

    //demo voter
    $('.voter-demo').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        clickEvents.closeDemoTypes();
        $('.login-wrapper').css('display', 'none');
        clickEvents.showLoginModal();
        loginDbCallMethods.launchVoterDashboard("5a29248d5653e9f0188a9391");
    });

    //when driver user clicks on Complete Registration
    $('.driver-register .reg-form-buttons .sign-up').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        driverDbCallMethods.driverRegisterClicked();
        clickEvents.closeDriverRegisterModal();
    });

    //when voter user clicks on Complete Registration
    $('.voter-register .reg-form-buttons .sign-up').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        voterDbCallMethods.voterRegisterClicked();
        clickEvents.closeVoterRegisterModal();
    });

    //-------jQuery Event Listeners-----------//
    //when logo is clicked
    $('.nav-logo').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.logoclick();
    });

    //show hamburger menu on small devices when sidebar icon is clicked
    $('.sidebar-icon').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.showHamburgerMenu();
    });

    //close hamburger menu on small devices when X is clicked
    $('.hamburger-close').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.closeHamburgerMenu();
    });

    //when demo link is clicked
    $('.demo-link').on('click', function(e){
        clickEvents.showDemoTypes();
        clickEvents.closeHamburgerMenu();
    });

    //when demo-link X is clicked
    $('.demo-types span').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.closeDemoTypes();
    });

    //when log in button has been clicked inside the login form
    $('#login-form-button').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        loginDbCallMethods.getLoginValues();
    });

    //when X on login modal is clicked
    $('.login-close button').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.closeLoginModal();
        clickEvents.showRegisterTypesModal();
        clickEvents.closeDriverRegisterModal();
        clickEvents.closeVoterRegisterModal();
    });

    //when Cancel button on login modal is clicked
    $('.login-cancel-forgot > button').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.closeLoginModal();
        clickEvents.resetLoginInputs();
        clickEvents.showRegisterTypesModal();
        clickEvents.closeDriverRegisterModal();
        clickEvents.closeVoterRegisterModal();
    });

    //when login link is clicked, show log in modal
    $('.login-link').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        clickEvents.closeHamburgerMenu();
        clickEvents.resetVoterForm();
        clickEvents.resetDriverForm();
        clickEvents.showLoginModal();
        clickEvents.closeRegisterModal();
    });

    //when register link is clicked, show register modal
    $('.register-link').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.closeHamburgerMenu();
        clickEvents.showRegisterModal();
    });

    //when cancel button is clicked on the register types modal
    $('.register-types > button').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.closeRegisterModal();
    });

    //when driver type sign up has been selected for registration
    $('.driver-selected').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.resetDriverForm();
        clickEvents.closeRegisterTypesModal();
        clickEvents.closeVoterRegisterModal();
        clickEvents.showDriverRegisterModal();
    });

    //when voter type sign up has been selected for registration
    $('.voter-selected').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.resetVoterForm();
        clickEvents.closeRegisterTypesModal();
        clickEvents.closeDriverRegisterModal();
        clickEvents.showVoterRegisterModal();
    });

    //to close the missing values message modal
    $('.missing-values button').on('click', function(e){
            e.stopPropagation();
            e.preventDefault();
            clickEvents.closeMissingValuesModal();
    });

    //when cancel on the registration modal is clicked
    $('.reg-form-buttons .cancel').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        clickEvents.resetVoterForm();
        clickEvents.resetDriverForm();
        clickEvents.closeDriverRegisterModal();
        clickEvents.closeVoterRegisterModal();
        clickEvents.showRegisterTypesModal();
    });

    //when howto link is clicked
    $('.howto-link').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.goToHowTo();
    });

    //when contact link is clicked
    $('.contact-link').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.goToContact();
    });

    //when learn more button is clicked, scroll to how to section
    $('.learn-more-button').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.goToHowTo();
    });

    //when button in incorrect credentials modal is clicked, close the modal
    $('.incorrect-credentials button').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.closeIncorrectCredentialsModal();
    });
  
    //when forgot password link is clicked, show forgot password modal
    $('#forgot').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.showForgotPasswordModal();
    });
  

    //when button in forgot password modal is clicked, close the modal
    $('#forgot-cancel').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.closeForgotPasswordModal();
    });


    //when the instructions card in how to is entered and left with mouse
    $('.thumb-instructions').mouseenter(function(){
        $(this).addClass('animated pulse');
        $(this).mouseleave(function(){
            $(this).removeClass('pulse');
        });
    });

    //when the learn more button is entered and left with mouse
    $('.learn-more-button').mouseenter(function(){
        $(this).addClass('animated pulse infinite');
        $(this).mouseleave(function(){
            $(this).removeClass('pulse');
        });
    });

    //when back to top is clicked
    $('footer .backtop').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        clickEvents.logoclick();
    });

    //social media icons
    $('.fa-facebook-official').on('click', function(e){
        window.open(`https://facebook.com/&quote=Help us put an end to these restrictions by volunteering to give someone a ride.`);
    });

    $('.fa-twitter').on('click', function(e){
        window.open(`https://twitter.com/&quote=Help us put an end to these restrictions by volunteering to give someone a ride.`);
    });
});
