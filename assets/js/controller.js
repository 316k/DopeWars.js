var c;
$(document).ready(function() {
    navigator.mozL10n.ready(function() {
        c = new Controller();
    });
});

function Controller() {
    var self = this;

    // Ask for player's name
    if(!window.localStorage.getItem('player_name')) {
        self.new_name();
    }

    this.coat = new Coat();

    this.view = new View();

    this.game = new GameManager();

    this.news_manager = new NewsManager();

    this.news_manager.add(new News('Welcome to DopeWars.js !'));

    this.view.refresh_prices(this.game.city.prices);
    this.view.refresh_available_drugs(this.game.city.available_drugs);
    this.view.refresh_stats(this.game, this.coat);
    this.view.refresh_news(this.news_manager.news);
    this.view.refresh_high_score(self.game.high_score());

    $('button.buy').click(function() {
        if(self.buy(parseInt($(this).parent().parent().data('drug')), parseInt($(this).prev().prev().val()))) {
            $(this).prev().prev().val(0);
        }
    });

    $('button.sell').click(function() {
        var index = parseInt($(this).parent().parent().data('drug'));
        var quantity = parseInt($(this).prev().prev().val());
        if(self.sell(index, quantity)) {
            $(this).prev().prev().val(0);
            $(this).parent().parent().children('td:nth-child(2)').text(self.coat.drugs[index]);
        }
    });

    $('button.buy-max').click(function() {
        var item_number = parseInt($(this).parent().parent().data('drug'));
        var quantity = self.coat.max_quantity(self.game.city.prices[item_number]);
        $(this).prev().val(quantity);
    });

    $('button.sell-max').click(function() {
        var item_number = parseInt($(this).parent().parent().data('drug'));
        var quantity = self.coat.drugs[item_number] || 0;
        $(this).prev().val(quantity);
    });

    $('a.new-game').click(function() {
        window.location = '';
    });

    $('a.new-name').click(function() {
        self.new_name();
    });

    $('#modal-cities .cities button[data-city]').click(function() {
        if(self.game.city.number == $(this).data('city')) {
            return;
        }

        if(self.game.day == self.game.end) {
            self.game_over();
        } else {
            self.news_manager.add(new News('Moving to ' + DataCenter.cities[$(this).data('city')].name, 'move'));

            self.game.new_city($(this).data('city'), self.news_manager);
            self.view.refresh_available_drugs(self.game.city.available_drugs);
            self.view.refresh_news(self.news_manager.news);

            $('button[data-city].current').removeClass('current');
            $(this).addClass('current');

            $('input.number').each(function() {
                $(this).prev().val(0);
            });

            self.view.refresh_news(self.news_manager.news);
            self.view.refresh_prices(self.game.city.prices);
            self.view.refresh_stats(self.game, self.coat);

            if(self.game.day == self.game.end) {
                $('a[href=#modal-cities]').html('<i class="glyphicon glyphicon-stop"></i> End').attr('href', '#').click(function() {
                    $('#modal-cities .cities button[data-city]:not(.current)').first().click();
                });
            }
        }

        $('#modal-cities').modal('hide');
        $('.navbar .navbar-collapse').removeClass('in');
    });

    $('a[href=#modal-pawn-shop]').click(function() {
        $('#modal-pawn-shop .form-group').removeClass('has-error');
        $('#modal-pawn-shop .debt').text(self.game.debt);
        $('#modal-pawn-shop input').val(0);
    });

    $('a[href=#modal-inventory]').click(function() {
        self.view.refresh_inventory(self.coat.drugs);
    });

    $('#modal-pawn-shop button.pay').click(function() {
        var amount = Math.min(parseInt($(this).parent().prev().val()), self.game.debt);

        if(self.coat.cash >= amount) {
            self.game.debt -= amount;
            self.coat.cash -= amount;
            $(this).parent().prev().val(0);

            self.view.refresh_stats(self.game, self.coat);
        } else {
            $(this).parent().parent().parent().addClass('has-error');
        }
    });

    $('#modal-pawn-shop button.land').click(function() {
        var amount = parseInt($(this).parent().prev().val());
        self.game.debt += amount;
        self.coat.cash += amount;

        $(this).parent().prev().val(0);
        self.view.refresh_stats(self.game, self.coat);
    });

    $('#modal-pawn-shop button.pay-max').click(function() {
        $(this).parent().prev().val(Math.min(self.coat.cash, self.game.debt));
    });



    $('#modal-inventory button.max').click(function() {
        $(this).parent().prev().val(parseInt($(this).parent().parent().parent().prev().text()));
    });

    $('#modal-inventory button.consume').click(function() {
        var index = parseInt($(this).parent().parent().parent().data('drug'));
        var quantity = Math.min(parseInt($(this).parent().parent().prev().children().first().children().first().val()), self.coat.drugs[index]);

        self.coat.drugs[index] -= quantity;
        self.game.stone_level += quantity;

        self.view.refresh_stone_level(self.game.stone_level);
        self.view.refresh_inventory(self.coat.drugs);
        self.view.refresh_quantities(self.coat.drugs);
        self.view.refresh_stats(self.game, self.coat);

        $(this).parent().parent().prev().children().first().children().first().val(0);
    });

    $('#modal-inventory button.drop').click(function() {
        var index = parseInt($(this).parent().parent().parent().data('drug'));
        var quantity = Math.min(parseInt($(this).parent().parent().prev().children().first().children().first().val()), self.coat.drugs[index]);

        self.coat.drugs[index] -= quantity;

        self.view.refresh_inventory(self.coat.drugs);
        self.view.refresh_quantities(self.coat.drugs);
        self.view.refresh_stats(self.game, self.coat);

        $(this).parent().parent().prev().children().first().children().first().val(0);
    });



    $('.buy-xs').click(function() {
        $('#modal-transaction input[type="number"]').val(0);

        $('#modal-transaction').removeClass('sell');
        $('#modal-transaction').addClass('buy').data('drug', $(this).parent().parent().data('drug'));
        $('#modal-transaction .modal-header h4').text('Buy ' + DataCenter.drugs[$(this).parent().parent().data('drug')].name);
        $('#modal-transaction .modal-body .action').text('Buy');

        $('#modal-transaction.buy button.max').click(function() {
            var item_number = parseInt($(this).parent().parent().parent().parent().parent().parent().parent().parent().data('drug'));
            var quantity = self.coat.max_quantity(self.game.city.prices[item_number]);

            $(this).parent().prev().val(quantity);
        });

        $('#modal-transaction.buy button.action').click(function() {
            var index = parseInt($(this).parent().parent().parent().parent().parent().parent().parent().parent().data('drug'));

            if(self.buy(index, parseInt($(this).parent().prev().val()))) {
                $(this).unbind('click');
            }
        });
    });

    $('.sell-xs').click(function() {
        $('#modal-transaction input[type="number"]').val(0);

        $('#modal-transaction').removeClass('buy');
        $('#modal-transaction').addClass('sell').data('drug', $(this).parent().parent().data('drug'));
        $('#modal-transaction .modal-header h4').text('Sell ' + DataCenter.drugs[$(this).parent().parent().data('drug')].name);
        $('#modal-transaction .modal-body .action').text('Sell');

        $('#modal-transaction.sell button.max').click(function() {
            var index = parseInt($(this).parent().parent().parent().parent().parent().parent().parent().parent().data('drug'));
            var quantity = self.coat.drugs[index] || 0;

            $(this).parent().prev().val(quantity);
        });

        $('#modal-transaction.sell button.action').click(function() {
            var index = parseInt($(this).parent().parent().parent().parent().parent().parent().parent().parent().data('drug'));
            var quantity = parseInt($(this).parent().prev().val());

            if(self.sell(index, quantity)) {
                $(this).unbind('click');
            }
        });
    });

    $('.stats_toggle').click(function() {
         $('.stats').slideToggle();
    });
}

Controller.prototype.buy = function(index, quantity) {
    if(!quantity) {
        return false;
    }

    var return_value = true;

    if(this.coat.can_buy(this.game.city.prices[index], quantity)) {
        this.coat.buy(index, this.game.city.prices[index], quantity);

        this.news_manager.add(new News('Bought ' + quantity + ' ' + DataCenter.drugs[index].name + ' for ' + this.game.city.prices[index] + ' $/each', 'drug'));

        this.view.refresh_quantities(this.coat.drugs);
        this.view.refresh_stats(this.game, this.coat);
    } else {
        this.news_manager.add(new News('You need more ' + (this.coat.available_space() >= quantity ? 'money' : 'space') + ' !', 'error'));
        return_value = false;
    }

    this.view.refresh_news(this.news_manager.news);
    return return_value;
};

Controller.prototype.sell = function(index, quantity) {
    if(!quantity) {
        return;
    }

    var return_value = true;

    if(this.coat.can_sell(index, quantity)) {
        this.coat.sell(index, this.game.city.prices[index], quantity);

        this.news_manager.add(new News('Sold ' + quantity + ' ' + DataCenter.drugs[index].name + ' for ' + this.game.city.prices[index] + ' $/each', 'drug'));
        this.view.refresh_stats(this.game, this.coat);
        this.view.refresh_quantities(this.coat.drugs);
    } else {
        this.news_manager.add(new News('You cannot sell stuff you do not own !', 'error'));
        return_value = false;
    }

    this.view.refresh_news(this.news_manager.news);
    return return_value;
};

Controller.prototype.new_name = function() {
    var name = prompt('Yo dude ! What\'s your name ?');

    while(!name) {
        name = prompt("*sigh*... Seriously, what's your name ?");
    }

    window.localStorage.setItem('player_name', name);
};

Controller.prototype.game_over = function() {
    var score = this.coat.score(this.game, this.game.city.prices);

    var high_score_string = score + '$ <span style="font-size: medium;"> <span class="hidden-xs">.................................................</span> by ' + this.game.player_name() + ' <small class="hidden-xs">on ' + new Date().toLocaleString() + '</small></span>';

    this.game.add_high_score(high_score_string);
    this.view.refresh_high_score(this.game.high_score());

    $('#modal-high-score .modal-footer .btn').text('New Game !');
    $('#modal-high-score .modal-body .final-score').html('<b>Final Score</b> : ' + score + '$');
    $('#modal-high-score .modal-body .message').html('.....<span class="hidden-xs">............................................</span> ' + this.game.message(score));

    $('#modal-high-score').on('hidden.bs.modal', function() {
        window.location = '';
    });

    $('#modal-high-score').modal('show');
};
