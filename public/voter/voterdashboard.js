$(document).ready(function() {
 let API_URL = 'https://secure-brushlands-88020.herokuapp.com/';
    const currentSettings = {};
    const updatedSettings = {};
    const query = window.location.search;
    const voterId = (query.split('?id=')[1]).toString();
    //set the default tab onload
    $('.js-pickups-list').css('display', 'block');
    $('.upcoming-pickups').css('border-bottom', '3px ridge #58635b');
    $('.js-account-settings').css('display', 'none');
    fetchVoterData();

    function fetchVoterData(id){
        $.ajax({
            method: "GET",
            url: `${API_URL}/voter/${voterId}`
        })
        .done(function(data) {
            storeAccountData(data);
            renderAccountInfo(currentSettings);
            //loadUpcomingPickups();
        });
    }

    function storeAccountData(data){
        currentSettings.firstName = data.userFullName.firstName;
        currentSettings.lastName = data.userFullName.lastName;
        currentSettings.phone = data.phoneNumber;
        currentSettings.email = data.email;
        currentSettings.username = data.userName;
        currentSettings.street = data.address.street;
        currentSettings.city = data.address.city;
        currentSettings.state = data.address.state;
        currentSettings.zip = data.address.zipcode;
    }

    function renderAccountInfo(obj){
        let welcomeMessage = `Welcome, ${currentSettings.firstName} ${currentSettings.lastName}!`;
        $('.profile-card h3').text(welcomeMessage);
        $("input[name=first-name]").val(currentSettings.firstName);
        $("input[name=last-name]").val(currentSettings.lastName);
        $("input[name=phone]").val(currentSettings.phone);
        $("input[name=email]").val(currentSettings.email);
        $("input[name=street]").val(currentSettings.street);
        $("input[name=city]").val(currentSettings.city);
        $("input[name=state]").val(currentSettings.state);
        $("input[name=zip]").val(currentSettings.zip);
        $(".js-username p").text(currentSettings.userName);
        $("input[name=password]").val(currentSettings.password);
    }

    function getUpdatedValues(){
        updatedSettings.phone = $("input[name=phone]").val();
        updatedSettings.email = $("input[name=email]").val();
        updatedSettings.password = $("input[name=password]").val();
        updatedSettings.street = $("input[name=street]").val();
        updatedSettings.city = $("input[name=city]").val();
        updatedSettings.state = $("input[name=state]").val();
        updatedSettings.zip = $("input[name=zip]").val();
        updatedSettings.firstName = $("input[name=first-name]").val();
        updatedSettings.lastName = $("input[name=last-name]").val();
        updateVoterData();
    }

    function updateVoterData(){
        $.ajax({
            method: "PUT",
            url: `${API_URL}/voter/${voterId}`,
            data: JSON.stringify({
                id: voterId,
                phoneNumber: updatedSettings.phone,
                firstName: updatedSettings.firstName,
                lastName: updatedSettings.lastName,
                address: {
                    street: updatedSettings.street,
                    city: updatedSettings.city,
                    state: updatedSettings.state,
                    zipcode: updatedSettings.zip
                },
                email: updatedSettings.email,
                password: updatedSettings.password
            }),
            contentType: "application/json; charset=utf-8"
        })
        .done(function(data){
            storeAccountData(data);
            renderAccountInfo(currentSettings);
        });
    }

    function loadDrivers(){
        $.ajax({
            method: "GET",
            url: `${API_URL}/schedules?active=true`
        })
        .done(function(data) {
            renderDriver(data);
        });
    }

    function renderDriver(data){
        $('.schedules-wrapper').empty();
        if(data.length >= 1){
            for(let i = 0; i < data.length; i++){
                let driverEntry = `<div class="js-schedule-entry">
                        <a href="javascript:void(0)" id="${data[i].driver._id}" class="driver-schedule"><p>${data[i].driver.firstName}</p></a>
                    </div>`;
                $('.schedules-wrapper').append(driverEntry);
            } 
        } else {
            $('.schedules-wrapper').append('<p>No one is offering a ride at the moment. Please try again later.</p>');
        }
    }

    /*function loadUpcomingPickups(){
        $.ajax({
            method: "GET",
            url: `${API_URL}/voter/${voterId}/pickups`
        })
        .done(function(data) {
            filterVoterPickups(data);
        });
    }

    function filterVoterPickups(data){
        if(data.length < 1){
            $('.js-pickups-list .no-pickups').css('display', 'block');
        }
        else{
            $('.js-pickups-list .no-pickups').css('display', 'none');
            const pickups = [];
            //loop through the elements
            for(let i=0; i < data.length; i++){
                for(let x=0; x < data[i].bookings.length; x++){
                    if(data[i].bookings[x].voter === voterId){
                        let nowMoment = moment();
                        let today = nowMoment.utc().format("LL");
                        let date = nowMoment.utc(data[i].bookings[x].date).format("LL");
                        let time = nowMoment(`${data[i].time.hour}:${data[i].time.minutes}`, 'HH:mm').format('LT');
                        //get only those dates for today or in the future
                        if(date >= today){
                            const pickupEntry = {
                            date: date,
                            time: time,
                            driver: data[i].driver.name,
                            id: data[i].driver._id
                            };
                            pickups.push(pickupEntry);
                        }
                        // else{
                        //     console.log(date, time);
                        // }
                    }
                }
            }
            let sortedPickups = pickups.sort(function(a, b){
                a = moment(a.date);
                b = moment(b.date);
                return a - b;
            });
            renderUpcomingPickups(sortedPickups);
        }
    }

    function renderUpcomingPickups(array){
        $('.js-pickups-list table tbody').empty();
        for(let i=0; i < array.length; i++){
            let pickupEntry = `<tr class="js-pickups-entry">
                                    <td>${array[i].date}</td>
                                    <td>${array[i].time}</td> 
                                    <td id="${array[i].id}" class="link-behavior">${array[i].driver}</a></td>
                                </tr>`;
            $('.js-pickups-list table tbody').append(pickupEntry);
            $('.link-behavior').css({'color':'#40386e', 'font-weight': 'bold', 'cursor': 'pointer'});
        }
    }*/

    function getDriverInfo(id){
        $.ajax({
            method: "GET",
            url: `${API_URL}/drivers/${id}`
        })
        .done(function(data) {
            showDriverInfo(data);
        });
    }

    function showDriverInfo(obj){
        $('.show-driver').empty();
        let driverInfo = `<h4>${obj.firstName}</h4>
              <p><i class="fa fa-map-marker fa-lg"></i>${obj.address.street}, ${obj.address.city} ${obj.address.state} ${obj.address.zipcode}</p>
              <p><i class="fa fa-phone fa-lg"></i>${obj.phoneNumber}</p>`;
        $('.show-driver').append(driverInfo);
        $('.show-driver-modal').css('display', 'block');
    }

    function loadDriverSchedule(driverId){
        $.ajax({
            method: "GET",
            url: `${API_URL}/schedules/${driverId}`
        })
        .done(function(data) {
            getAvailableDates(data);
        });
    }

    function getAvailableDates(data){
        let time = moment(`${data.data.time.hour}:${data.data.time.minutes}`, 'HH:mm').format('LT');
        const availableDates = {
            schedId: data.data._id,
            driverName: data.data.driver.firstName,
            dates: [],
            time: time
        };
        for(var prop in data.availBookDates){
            if(data.availBookDates[prop] === true){
                const date = moment(prop).format("LL");
                availableDates.dates.push(date);
            }
        }
        renderAvailableDates(availableDates);
    }

    function renderAvailableDates(obj){
        $('.js-dates-wrapper').empty();
        $('.schedule-info-card h4').text(obj.driverName);
        if(obj.dates.length != 0){
            $('.schedule-info-card p').text(`Pick up time is ${obj.time}.`);
        } else {
            $('.schedule-info-card p').text(`Sorry, all dates are booked so far.`);
        }
        for(let i=0; i < obj.dates.length; i++){
            let dateEntry = `<div class="js-avail-bookings" id="${obj.schedId}">
                                <p>${obj.dates[i]}</p>
                            </div>`;
        $('.js-dates-wrapper').append(dateEntry);
        }
    }

    function bookTheDate(schedId, date){
        const loadVoters = 
            $.ajax({
            method: "PUT",
            url: `${API_URL}/schedules/${schedId}`,
            data: JSON.stringify({
                date: date,
                voter: voterId,
                voter: `${currentSettings.firstName}`
            }),
            contentType: "application/json; charset=utf-8"
        })
        .done(function(){
            loadVoters();
        });
    }  

//--------click events-------------//
    const clickEvents = {
        closeHamburgerMenu: function(){
            setTimeout(function(){
                    $('.hamburger-menu').css('display', 'none');
                }, 1000);
            $('.hamburger-menu').removeClass('fadeInRight').addClass('fadeOutRight');
        },
        clickBrowseSched: function(){
            loadDrivers();
            this.closeHamburgerMenu();
            renderAccountInfo();
            $('.profile-card > h3').css('display', 'none');
            $('.profile-nav').css('display', 'none');
            $('.js-pickups-list').css('display', 'none');
            $('.js-account-settings').css('display', 'none');
            $('.browse-schedules').css('display', 'block');
            $('.nav-links .dashboard-link').css('display', 'inline-block');
            $('.hamburger-menu .dashboard-link').css('display', 'block');
            $('.browse-sched-link').css('display', 'none');
        },
        showHamburgerMenu: function(){
            $('.hamburger-menu').removeClass('fadeOutRight').css('display', 'block').addClass('fadeInRight');
        },
        closeAvailableDates: function(){
            setTimeout(function(){
                    $('.schedule-info-modal').css('display', 'none');
                }, 1000);
            $('.schedule-info-modal').removeClass('fadeInDown').addClass('fadeOutDown');
        },
        openDriverAvailDates: function(){
            $('.schedule-info-modal').css('display', 'block');
        },
        clickDashboardLink: function(){
            //loadUpcomingPickups();
            this.closeHamburgerMenu();
            this.closeAvailableDates();
            $('.profile-card > h3').css('display', 'block');
            $('.profile-nav').css('display', 'block');
            $('.js-pickups-list').css('display', 'block');
            $('.js-account-settings').css('display', 'none');
            $('.browse-schedules').css('display', 'none');
            $('.dashboard-link').css('display', 'none');
            $('.nav-links .browse-sched-link').css('display', 'inline-block');
            $('.hamburger-menu .browse-sched-link').css('display', 'block');
            $('.upcoming-pickups').css('border-bottom', '3px ridge #58635b');
            $('.account-settings').css('border-bottom', 'none');
            $('.cancel-changes').attr('hidden', 'true');
            $('.edit-details').removeAttr('hidden');
            $('.js-account-settings input').attr('readonly', 'true').css({'border-bottom': 'none', 'font-style': 'normal', 'outline': 'none'});
        },
        closeSuccessModal: function(){
            $(".success-modal").css("display", "none");
        },
        clickSaveChanges: function(){
            this.closeHamburgerMenu();
            //check if info is being edited first
            if($('.js-account-settings input').css('font-style') == 'italic'){
                //make sure that all editable contents have value before saving
                if($('input[name="first-name"]').val() && $('input[name="last-name"]').val() && $('input[name="phone"]').val() && $('input[name="email"]').val() && $('input[name="street"]').val() && $('input[name="city"]').val() && $('input[name="state"]').val() && $('input[name="zip"]').val() && $('input[name="password"]').val()){
                    getUpdatedValues();
                    $('.success-modal').css('display', 'block').find('p').text('Account has been updated!');
                    $('.cancel-changes').attr('hidden', 'true');
                    $('.edit-details').removeAttr('hidden');
                    $('.js-account-settings input').attr('readonly', 'true').css({'border-bottom': 'none', 'font-style': 'normal', 'outline': 'none'});
                }
                else{
                    $('.success-modal').css('display', 'block').find('p').text('Please make sure all entries have values.');
                }                
            }
            else{
                $('.success-modal').css('display', 'block').find('p').text('Your information is up to date.');
            }
        },
        cancelEditInfo: function(){
            this.closeHamburgerMenu();
            renderAccountInfo();
            $(".success-modal").css("display", "none");
            $('.cancel-changes').attr('hidden', 'true');
            $('.edit-details').removeAttr('hidden');
            $('.js-account-settings input').attr('readonly', 'true').css({'border-bottom': 'none', 'font-style': 'normal', 'outline': 'none'});
        },
        editInfo: function(){
            this.closeHamburgerMenu();
            $('.cancel-changes').removeAttr('hidden');
            $('.edit-details').attr('hidden', 'true');
            $(".success-modal").css("display", "none");
            $('.js-account-settings input').removeAttr('readonly').css({'border-bottom': '1px solid black', 'font-style': 'italic'});
        },
        clickUpcomingPickups: function(){
            this.closeHamburgerMenu();
            renderAccountInfo();
            $('.cancel-changes').attr('hidden', 'true');
            $('.edit-details').removeAttr('hidden');
            $('.account-settings').css('border-bottom', 'none');
            $('.upcoming-pickups').css('border-bottom', '3px ridge #58635b');
            $('.js-pickups-list').css('display', 'block');
            $('.js-account-settings').css('display', 'none');
            $('.js-account-settings input').attr('readonly', 'true').css({'border-bottom': 'none', 'font-style': 'normal', 'outline': 'none'});
        },
        clickAccountSettings: function(){
            this.closeHamburgerMenu();
            $('.upcoming-pickups').css('border-bottom', 'none');
            $('.account-settings').css('border-bottom', '3px ridge #58635b');
            $('.js-pickups-list').css('display', 'none');
            $('.js-account-settings').css('display', 'block');
        },
        afterBookingTheDate: function(){
            $('.date-booked').css('display', 'none');
            $('.booking-confirmation').css('display', 'none');
            $('.schedule-info-modal').css('display', 'none');
        },
        bookDateSuccessful: function(event){
            const schedId = $('.js-avail-bookings').attr('id');
            const date = $(this).text();
            $('.booking-confirmation').css('display', 'block');
            //when yes was clicked to book the date
            $('.book-yes').on('click', function(event){
                event.preventDefault();
                event.stopPropagation();
                bookTheDate(schedId, date);
                $('.booking-confirmation').css('display', 'none');
                $('.date-booked').css('display', 'block');
            });
        },
        openDriverSched: function(event){
            let driverId = $(this).attr('id');
            loadDriverSchedule(driverId);
            $('.schedule-info-modal').removeClass('fadeOutDown').css('display', 'block').addClass('fadeInDown');
        }
    }

    $('.dashboard-link').on('click', function(){
        clickEvents.clickDashboardLink();
    });

    $('.js-schedule-entry').on('click', function(event){
        event.stopPropagation();
        clickEvents.openDriverAvailDates();
    });

    $('.avail-bookings-buttons button').on('click', function(event){
        event.stopPropagation();
        clickEvents.closeAvailableDates();
    });
    $('.sidebar-icon').on('click', function(){
        clickEvents.showHamburgerMenu();
    });
    $('.hamburger-close').on('click', function(){
        clickEvents.closeHamburgerMenu();
    });

    $('.browse-sched-link').on('click', function(){
        clickEvents.clickBrowseSched();
        $('.show-driver-modal').css('display', 'none');
    });

    $('.js-pickups-list').on('click', 'td', function(e){
        e.stopPropagation();
        e.preventDefault();
        let id = $(this).attr('id');
        if(typeof(id) === 'string'){
            getDriverInfo(id);
        }
    });

    $('.show-driver-modal span').on('click', function(){
        $('.show-driver-modal').css('display', 'none');
    });

    $('.success-modal button').on('click', function(event){
        event.stopPropagation();
        clickEvents.closeSuccessModal();
    });

    $('.account-settings-buttons > .save-changes').on('click', function(event){
        event.preventDefault();
        event.stopPropagation();
        clickEvents.clickSaveChanges();
    });

    $('.account-settings-buttons > .cancel-changes').on('click', function(event){
        event.preventDefault();
        event.stopPropagation();
        clickEvents.cancelEditInfo();
    });

    $('.account-settings-buttons > .edit-details').on('click', function(event){
        event.preventDefault();
        event.stopPropagation();
        clickEvents.editInfo();
    });

    $('.upcoming-pickups').on('click', function(){
        clickEvents.clickUpcomingPickups();
    });

    $('.account-settings').on('click', function(){
        clickEvents.clickAccountSettings();
        $('.show-driver-modal').css('display', 'none');
    });

    $('.date-booked-card button').on('click', function(event){
        event.stopPropagation();
        clickEvents.afterBookingTheDate();
    });

    $('.book-no').on('click', function(event){
        event.preventDefault();
        event.stopPropagation();
        $('.booking-confirmation').css('display', 'none');
    });

    $('.js-dates-wrapper').on('click', '.js-avail-bookings', function(event){
        event.stopPropagation();
        clickEvents.bookDateSuccessful.call(this, event);
    });

    $('.schedules-wrapper').on('click', 'a', function(event){
        event.preventDefault();
        event.stopPropagation();
        clickEvents.openDriverSched.call(this, event)
    });
});
