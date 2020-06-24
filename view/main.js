

let PersonModel = Backbone.Model.extend({
    initialize: function () {
        console.log("person model to initialize");
    },

    defaults: {
        firstName: "",
        lastName: ""
    },

    urlRoot: 'http://localhost:8080/person'
})

let PersonCollection = Backbone.Collection.extend({
    model: PersonModel,
    url: 'http://localhost:8080/listperson'
})

let PersonView = Backbone.View.extend({
    template: $('#template-person').html(),
    tagname: 'li',
    events: {
        'click .remove-person': 'removePerson'
    },

    initialize: function () {
        //console.log("render personview")
        this.render();
    },


    render: function () {
        let html = Mustache.to_html(this.template, this.model)
        $('#list-person').append(this.$el.html(html));
    },


    removePerson: function () {

        let person = new PersonModel({
            id : this.model.id
        });
        console.log(this.model)
        person.destroy({
           success: ()=>{
               this.$el.remove();
           }
       })
    }


})


let PersonCollectionView = Backbone.View.extend({
    el: $('#form-person'),
    events: {
        'click button': 'addPerson',
    },

    initialize: function () {

        this.render();
    },

    render: function () {

        console.log(this.collection.models);
        _.each(this.collection.models, (model) => {
            //console.log(model)
            this.renderPerson(model.toJSON());
        });
    },

    renderPerson: function (person) {
        //console.log(person)
        new PersonView({
            model: person
        });
    },
    addPerson: function () {
        let data = {
            firstName: $('#fname').val(),
            lastName: $('#lname').val(),
        }
        //console.log(data)
        let person = new PersonModel();

        person.save(data,
            {
                success: (res) => {
                    this.renderPerson(data);
                    //reset value
                    $('#fname').val("");
                    $('#lname').val("");
                    //update collection
                    
                    //person.set({id : res.toJSON().id});
                    //console.log(person1);
                    //console.log(person)
                    this.collection.add(person);
                }
            })
    }
})



let app = new PersonCollection();

app.fetch({
    success: function (res) {
        new PersonCollectionView({
            collection: res
        })
    }
})

