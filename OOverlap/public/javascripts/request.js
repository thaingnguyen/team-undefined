$(document).ready(function() {
    var free_times = [];

    /* initialize the external events
    -----------------------------------------------------------------*/
    $('#external-events .fc-event').each(function() {

        // store data so the calendar knows to render an event upon drop
        $(this).data('event', {
            title: $.trim($(this).text()), // use the element's text as the event title
            stick: true, // maintain when user navigates (see docs on the renderEvent method)
            overlap: false
        });

        // make the event draggable using jQuery UI
        $(this).draggable({
            zIndex: 999,
            revert: true, // will cause the event to go back to its
            revertDuration: 0 //  original position after the drag
        });

        $(this).data('duration', '01:00');
    });

    $('#submit_request').bind('click',
        function(event){
            for (var i=0; i<free_times.length; i++){
                console.log(free_times[i].start.format() + " " + free_times[i].end.format());
            }
            // $.ajax({
            //     type: 'POST',
            //     url: '/user/request/submit',
            //     data: free_times
            // });
    });

    $.ajax({
        url: '/user/request/schedule',
        type: 'GET',
        success: function(data) {
            $('#calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                defaultView: 'agendaWeek',
                editable: true,
                droppable: true,
                eventLimit: true, // allow "more" link when too many events
                events: data,
                eventReceive: function(event) {
                    free_times.push(event);
                },
                eventDrop: function( event, delta, revertFunc, jsEvent, ui, view ) { 
                    for (var i=0; i<free_times.length; i++){
                        if (event._id === free_times[i]._id){
                            free_times[i] = event;
                            break;
                        }
                    }
                },
                eventResize: function( event, delta, revertFunc, jsEvent, ui, view ) { 
                    for (var i=0; i<free_times.length; i++){
                        if (event._id === free_times[i]._id){
                            free_times[i] = event;
                            break;
                        }
                    }
                }
            });
        },
        error: function(e) {
            console.log("FAIL");
        }
    });
});