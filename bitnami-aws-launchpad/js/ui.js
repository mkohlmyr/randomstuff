jQuery('.ui-input-wrapper-cell > .ui-input:not(select)').focus(function () {
    $(this).parent().addClass('focus');
});

jQuery('.ui-input-wrapper-cell > .ui-input:not(select)').focusout(function () {
    $(this).parent().removeClass('focus');
});

var last, now, prev, regret;
jQuery('#ami_name').keyup(function () {
    window.ui.filter = $(this).val();
    now = Date.now();

    if (prev && prev > window.ui.filter.length) {
        prev = window.ui.filter.length;
        regret = true;
    }
    if (window.ui.filter.length > 1 && (!last || now > (last + 512))) {
        console.log('accepted');
        last = now;
        window.setTimeout(function () {
            console.log('executing');
            window.ui.filter_amis(regret);
            regret = false;
        }, 512);
    }
});

jQuery('.ui-btn.page').click(function (evt) {
    try {
        if (!window.ws) {
            window.ws = new window.WebSocketWrapper();
        }

        var page = $(this).parents('.ui-page[data-page]').first(),
            name = page.attr('data-page');

        console.log(page, name);

        if (name === 'authentication') {
            var access_key = page.find('#access_key').val(),
                secret_key = page.find('#secret_key').val(),
                region_id = page.find('#region_id').val();

            $(this).text('Verifying credentials..');

            window.ws.authenticate(access_key, secret_key, region_id);
        }

        evt.preventDefault();
    } catch (e) {
        window.ui.error(e.message);
    }
});

var UserInterface = function () {
    var self = this;
    this.filter = undefined;
    this.amis_discarded = [];
    this.amis = [];

    this.error = function (error) {
        console.error(error);
    };

    this.authentication = function () {
        jQuery('.ui-page:visible').fadeOut(256, function () {
            jQuery('.ui-page[data-page="authentication"]').show();
        });
    };

    this.description = function (data) {
        var show = false;
        if (this.filter) {
            data.images.forEach(function (ami) {
                if (ami.name.indexOf(self.filter) > -1) {
                    self.amis.push(ami);
                    show = true;
                } else {
                    self.amis_discarded.push(ami);
                }
            });
        } else {
            this.amis = this.amis.concat(data.images);
        }

        this.update_amis(show);
    };

    this.selection = function () {
        window.ws.describe();
        jQuery('.ui-page:visible').fadeOut(256, function () {
            jQuery('.ui-page[data-page="selection"]').show();
        });
    };

    this.filter_amis = function (regret) {
        console.log('regret:', regret);
        this.amis = this.amis.filter(function (ami) {
            if (ami.name.indexOf(self.filter) > -1) {
                return true;
            } else {
                self.amis_discarded.push(ami);
                return false;
            }
        });

        if (regret) {
            console.log('had regret, reevaluating');
            this.amis_discarded = this.amis_discarded.filter(function (ami) {
                if (ami.name.indexOf(self.filter) > -1) {
                    self.amis.push(ami);
                    return false;
                } else {
                    return true;
                }
            });
        }

        this.update_amis(true);
    };

    this.update_amis = function (show) {
        var selector = jQuery('#ami_selector'),
            options = selector.children('.ui-row-wrapper-table');

        jQuery('#amis_matching').text(this.amis.length);

        if (show && this.amis.length < 100) {
            var show_new = function () {
                var divider = $('<div class="ui-input-divider-cell"></div>'),
                    launch = $('<a class="ui-btn launch" href="#">Launch</a>'),
                    cell = $('<div class="ui-ami-wrapper-cell"></div>'),
                    row = $('<div class="ui-row-wrapper-table"></div>');

                self.amis.forEach(function (ami) {
                    if (!jQuery('#' + ami.id).length) {
                        var local_row = row.clone().appendTo(selector).attr('id', ami.id),
                            name_text = ami.name,
                            width = jQuery('#ami_name').width();

                        local_row.append(cell.clone().text(name_text).css({maxWidth: width, width: width}));
                        local_row.append(divider.clone());
                        local_row.append(launch.clone().click(function () {
                            window.ws.launch(ami);
                        }));

                    }
                });
            };

            if (options.length) {
                console.log('had options, reevaluating'); //PROBABLY WHAT WAS BUGGY. MAKE SURE TO TEST THIS


                var deferred = options.map(function () {
                    var ami_element = $(this);
                    var same = function (ami) {
                        return ami.id === ami_element.attr('id');
                    };
                    if (!self.amis.some(same)) {
                        return $(this).fadeOut(256, function () {
                            $(this).remove();
                        });
                    }
                }).get();
                // DONT THINK THIS EVER GOT CALLED
                $.when.apply(null, deferred).then(show_new);
            } else {
                console.log('showing new');
                show_new();
            }
        } else if (options.length) {
            console.log('dont show, but remove');
            options.fadeOut(256, function () {
                $(this).remove();
            });
        }
    };

    this.launch = function (data) {
        jQuery('.ui-page:visible').fadeOut(256, function () {
            jQuery('#launched_ami_name').text(data.ami.name);
            jQuery('#launched_key_name').text(data.key_name);
            jQuery('#launched_private_key').text(data.private_key);
            jQuery('#launched_key_digest').text(data.key_digest);
            jQuery('#launched_state').text(data.state);

            jQuery('.ui-page[data-page="launch"]').show();
        });
    };
};

window.ui = new UserInterface();
