var my = my || {};

$(function() {
    var photoPath = "/images/";

    //function helper
    my.formatCurrency = function(value) {
        return "$" + value.toFixed(2);
    };

    //create product models
    my.Product = function() {
        this.id = ko.observable();
        this.salePrice = ko.observable();
        this.photo = ko.observable();
        this.shortDescription = ko.observable();
        this.photoUrl = ko.computed(function() {
                return photoPath + this.photo();
            },
            this);
    };

    //create line item objects
    my.LineItem = function() {
        var self = this;
        self.product = ko.observable();
        self.quantity = ko.observable();
        self.extendedPrice = ko.computed(function() {
            var x = this;
            return self.product() ? self.product().salePrice() * parseInt("0" + self.quantity(), 10) : 0;
        });
    };

    //view model
    my.vm = {
        metadata: {
            link: "test.com"
        },
        products: ko.observableArray([]),
        lines: ko.observableArray([new my.LineItem()]),
        addLine: function() {
            var x = this;
            this.lines.push(new my.LineItem());
        },
        removeLine: function(line) {
            my.vm.lines.remove(line);
            var x = this;
        },
        loadProducts: function() {
            $.each(my.sampleData.data.Products,
                function(i, p) {
                    var x = this;
                    my.vm.products.push(new my.Product()
                        .id(p.Id)
                        .salePrice(p.SalePrice)
                        .photo(p.Photo)
                        .shortDescription(p.Model.Name)
                    );
                });
        }
    };

    my.vm.grandTotal = ko.computed(function () {
    var total = 0;
    $.each(this.lines(),
        function () {
            total += this.extendedPrice();
        });
    return total;
    }, my.vm);

    my.vm.loadProducts();
    ko.applyBindings(my.vm);
});


