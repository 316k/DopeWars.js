function rand(min_rand, max_rand) {
    return min_rand + (Math.random()*10000 % (max_rand - min_rand));
}

function shuffle(array) {
    var shuffled = [], index;

    for(var i=0; i<array.length; i++) {
        while((index = parseInt(rand(0, array.length))) in shuffled);

        shuffled[index] = array[i];
    }

    return shuffled;
}

function array_sort(a, b) {
    a = parseInt(a);
    b = parseInt(b);

    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    } else {
        return 0;
    }
}

function pop_array(array, from_index) {
    var popped = [];

    for(var i=0; i < from_index; i++) {
        popped[i] = array[i];
    }

    popped[from_index] = null;

    for(var i=from_index+1; i<array.length; i++) {
        popped[i] = array[i-1];
    }

    return popped;
}

function array_sum(array) {
    var sum = 0;

    for(var i in array) {
        sum += parseInt(array[i] || 0);
    }

    return sum;
}

// GameManager
function GameManager() {
    this.day = 1;
    this.end = 30;
    this.debt = 5500;
    this.bank_deposit = 0;
    this.stone_level = 0;
    this.city = new City(0);
}

GameManager.prototype.is_game_over = function() {
    return this.day >= this.end;
};

GameManager.prototype.new_city = function(number, news_manager) {
    this.city = new City(number, news_manager);
    this.day++;
    this.debt *= 1.1;
    this.debt = Math.round(this.debt);
};

GameManager.prototype.player_name = function() {
    return window.localStorage.getItem('player_name') || '';
};

GameManager.prototype.high_score = function() {
    var scores = [];

    for(var i=0; i<10; i++) {
        scores[i] = window.localStorage.getItem('high-score-' + i);
    }

    return scores;
};

GameManager.prototype.add_high_score = function(score) {
    var scores = this.high_score();

    for(var i=0; i<10; i++) {
        if(parseInt(scores[i]) < parseInt(score) || scores[i] == 'null' || scores[i] == null) {
            scores = pop_array(scores, i);
            scores[i] = score;

            for(var j in scores) {
                window.localStorage.setItem('high-score-' + j, scores[j]);
            }

            return;
        }
    }
};

GameManager.prototype.reset_high_score = function() {
    for(var i=0; i<10; i++) {
        window.localStorage.removeItem('high-score-' + i);
    }
};

GameManager.prototype.message = function(score) {
    for(var max_score in DataCenter.messages) {
        if(parseInt(max_score) <= score) {
            return DataCenter.messages[parseInt(max_score)];
        }
    }

    return "I won't say nothin' without my lawyer with me...";
}

// Coat
function Coat() {
    this.drugs = [];
    this.cash = 2000;
    this.guns = [];
    this.health = 100;
    this.total_space = 100;
}

Coat.prototype.available_space = function() {
    var available_space = this.total_space;

    for(var i in this.drugs) {
        available_space -= this.drugs[i];
    }

    return available_space;
};

Coat.prototype.used_space = function() {
    return this.total_space - this.available_space();
};

Coat.prototype.add = function(drug, quantity) {
    this.drugs[drug] = this.drugs[drug] || 0;
    this.drugs[drug] += quantity;
};

Coat.prototype.can_buy = function(price, quantity) {
    return this.available_space() >= quantity && this.cash >= price*quantity;
};

Coat.prototype.can_sell = function(item, quantity) {
    return this.drugs[item] >= quantity;
};

Coat.prototype.buy = function(item, price, quantity) {
    this.cash -= price * quantity;
    this.add(item, quantity);
};

Coat.prototype.sell = function(item, price, quantity) {
    this.cash +=  price * quantity;
    this.drugs[item] -= quantity;
};

Coat.prototype.max_quantity = function(price) {
    return Math.min(this.available_space(), Math.floor(this.cash/price));
};

Coat.prototype.score = function(game, prices) {
    var score = this.cash - game.debt;

    for(var drug in this.drugs) {
        score += (this.drugs[drug] * prices[drug]) || 0;
    }

    return Math.round(score);
};

// City
function City(number, news_manager) {
    this.city_name = DataCenter.cities[number].name;
    this.is_cop = Math.random()*100 < DataCenter.cities[number].cops;
    this.prices = [];
    this.number = number;
    this.available_drugs = [];


    // Available drugs
    var max_drugs = (max_drugs in DataCenter.cities[number] ? DataCenter.cities[number].max_drugs : DataCenter.drugs.length);

    var number_of_drugs = parseInt(rand(DataCenter.cities[number].min_drugs, max_drugs));
    for(var i=0; i<number_of_drugs; i++) {
        this.available_drugs[i] = true;
    }

    for(var i=number_of_drugs; i<DataCenter.drugs.length; i++) {
        this.available_drugs[i] = false;
    }

    this.available_drugs = shuffle(this.available_drugs);

    // Prices
    for(var drug in DataCenter.drugs) {
        if(this.available_drugs[parseInt(drug)]) {
            var minimum_price = DataCenter.drugs[drug].minimum_price;
            var maximum_price = DataCenter.drugs[drug].maximum_price;

            if('cheap' in DataCenter.drugs[drug] && rand(0, 100) < 5 && news_manager != null) {
                minimum_price = DataCenter.drugs[drug].cheap.minimum_price;
                maximum_price = DataCenter.drugs[drug].cheap.maximum_price;

                news_manager.add(new News(DataCenter.drugs[drug].cheap.announce));
            } else if('expensive' in DataCenter.drugs[drug] && rand(0, 100) < 5 && news_manager) {
                minimum_price = DataCenter.drugs[drug].expensive.minimum_price;
                maximum_price = DataCenter.drugs[drug].expensive.maximum_price;

                news_manager.add(new News(DataCenter.drugs[drug].expensive.announce));
            }

            this.prices[drug] = Math.round(rand(minimum_price, maximum_price));
        }
    }
}

// News & NewsManager
function News(text, type) {
    this.text = text;
    this.type = type || '';
}

function NewsManager() {
    this.news = [];
    this.limit = 15;
}

NewsManager.prototype.add = function(news) {
    this.news.reverse();

    // Keep only this.limit news
    if(this.news.length == this.limit) {
        this.news.shift();
    }

    this.news.push(news);

    this.news.reverse();
};
