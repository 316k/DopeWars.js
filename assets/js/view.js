function View(drugs) {
    this.news = $('.news ul');
    this.drugs_container = $('.drugs tbody');

    this.setup_drugs();
    this.setup_cities();

    this.refresh_prices([]);
    this.refresh_quantities([]);
}

View.prototype.setup_drugs = function() {
    var row_template = this.drugs_container.children('tr[data-drug]').first();
    var drugs = DataCenter.drugs;

    for(var drug in drugs) {
        var row = row_template.clone();

        row.data('drug', drug);

        row.children().first().text(navigator.mozL10n.get('dope-' + drugs[drug].name));

        this.drugs_container.append(row);
    }

    row_template.remove();
    this.drugs = $('.drugs tbody tr[data-drug]');

    // Inventory
    row_template = $('#modal-inventory tr.template');

    for(var drug in drugs) {
        var row = row_template.clone().removeClass('template');

        row.data('drug', drug);

        $('#modal-inventory tbody').append(row);
    }

    row_template.remove();
};

View.prototype.setup_cities = function() {
    for(var city in DataCenter.cities) {
        $('#modal-cities .cities').append('<button class="btn" data-city="' + city + '">' + 
            navigator.mozL10n.get('city-' + DataCenter.cities[city].name) + '</button> ');
    }
    $('#modal-cities .cities button.btn').first().addClass('current');
}

View.prototype.refresh_quantities = function(quantities) {
    for(var drug=0; drug < this.drugs.length; drug++) {
        this.drugs.get(drug).children[1].innerHTML = quantities[drug]  || 0;
    }
};

View.prototype.refresh_prices = function(prices) {
    for(var drug=0; drug < this.drugs.length; drug++) {
        this.drugs.get(drug).children[2].innerHTML = (prices[drug] || 0) + '$';
    }
};

View.prototype.refresh_news = function(notifications) {
    this.news.empty();
    for(var notification in notifications) {
        this.news.append('<li class="' + notifications[notification].type + '">' + notifications[notification].text + '</li>');
    }

    $('.news.visible-xs').readmore({
        maxHeight: 40,
        moreLink: '<a href="#" style="padding-top: 15px; text-align: center; font-size: small;">' + navigator.mozL10n.get('see-recent-news') + '</a>',
        lessLink: '<a href="#" style="padding-top: 15px; text-align: center; font-size: small;">' + navigator.mozL10n.get('hide') + '</a>',
    });
};

View.prototype.refresh_stats = function(game, coat) {
    $('.stats .city, .xs-stats .city').text(game.city.city_name);
    $('.stats .day, .xs-stats .day').text(game.day);
    $('.stats .end, .xs-stats .end').text(game.end);
    $('.stats .debt, .xs-stats .debt').text(Math.round(game.debt));
    $('.stats .bank_deposit').text(game.bank_deposit);

    $('.stats .cash, .xs-stats .cash').text(coat.cash);
    $('.stats .guns').text(coat.guns.length);
    $('.stats .health').text(coat.health);
    $('.stats .used_space, .xs-stats .used_space').text(coat.used_space());
    $('.stats .total_space, .xs-stats .total_space').text(coat.total_space);
};

View.prototype.refresh_available_drugs = function(available_drugs) {
    $('tr[data-drug].hidden').removeClass('hidden');

    for(var drug in available_drugs) {
        if(!available_drugs[drug]) {
            $('tr[data-drug]:nth-child(' + (parseInt(drug) + 2) + ')').addClass('hidden');
        }
    }
};

View.prototype.refresh_high_score = function(high_score) {
    $('#modal-high-score ul').empty();

    for(var i in high_score) {
        if(high_score[i] != 'null' && high_score[i] != null) {
            $('#modal-high-score ul').append('<li>' + high_score[i] + '</li>');
        }
    }
};

View.prototype.refresh_stone_level = function(stone_level) {
    var colors = ['red', 'yellow', 'green', 'blue', 'orange'];

    $('body *').each(function() {
        if(rand(0, 100) < stone_level/2) {
            $(this).css({
                transform: 'rotate(' + rand(0, stone_level/4) + 'deg)',
                color: colors[parseInt(rand(0, colors.length-1))],
                backgroundColor: colors[parseInt(rand(0, colors.length-1))],
                letterSpacing: ((rand(0, stone_level) > stone_level/6) ? '-4px' : '0px'),
            });
        }
    });
};

View.prototype.refresh_inventory = function(drugs) {
    for(var drug in drugs) {
        var row = $('#modal-inventory tr:nth-child(' + (parseInt(drug) + 2) + ')').removeClass('hidden');

        row.children().first().text(navigator.mozL10n.get('dope-' + DataCenter.drugs[drug].name));
        row.children().first().next().text(drugs[drug] || 0);
        row.children().first().next().next().children().first().children().first().val(drugs[drug] || 0).attr('max', drugs[drug] || 0);

        if((drugs[drug] || 0) == 0) {
            row.addClass('hidden');
        }
    }

    if(array_sum(drugs) == 0) {
        $('#modal-inventory p').text(navigator.mozL10n.get('no-drug-yet'));
    } else {
        $('#modal-inventory p').text('');
    }
};
