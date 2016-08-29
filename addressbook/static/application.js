"use strict";

const db = new Dexie("addressbook");

db.version(1).stores({
    person: "++id,name,&tel,&email,address.city,address.street,address.building,address.dwelling,address.postcode",
    organisation: "++id,&name,&tel,&url,address.city,address.street,address.building,address.dwelling,address.postcode",
    association: "++id,&[pid+oid]"
});

class Person {
    constructor(name, tel, email, address) {
        this.name = name;
        this.tel = tel;
        this.email = email;
        this.address = address;
    }

    static fromFormData(form) {
        const values = $(form).serializeArray();
        const person = new Person(
            values[0].value,
            values[6].value,
            values[7].value,
            {
                city: values[1].value,
                postcode: values[2].value,
                street: values[3].value,
                building: values[4].value,
                dwelling: values[5].value
            }
        );
        if (values[8] && values[8].value) {
            person.id = parseInt(values[8].value, 10);
        }
        return person;
    }

    static getColumns() {
        return ["#", "name", "tel", "email", "city"];
    }

    getRow() {
        return [
            React.createElement(
                "td",
                null,
                React.createElement(
                    "a",
                    {href: `/people/${this.id}`},
                    this.id
                )
            ),
            React.createElement("td", null, this.name),
            React.createElement("td", null, this.tel),
            React.createElement("td", null, this.email),
            React.createElement("td", null, this.address.city)
        ];
    }
}

class Organisation {
    constructor(name, tel, url, address) {
        this.name = name;
        this.tel = tel;
        this.url = url;
        this.address = address;
    }

    static fromFormData(form) {
        const values = $(form).serializeArray();
        const org = new Organisation(
            values[0].value,
            values[6].value,
            values[7].value,
            {
                city: values[1].value,
                postcode: values[2].value,
                street: values[3].value,
                building: values[4].value,
                dwelling: values[5].value
            }
        );
        if (values[8] && values[8].value) {
            org.id = parseInt(values[8].value, 10);
        }
        return org;
    }

    static getColumns() {
        return ["#", "name", "tel", "url", "city"];
    }

    getRow() {
        return [
            React.createElement(
                "td",
                null,
                React.createElement(
                    "a",
                    {href: `/organisations/${this.id}`},
                    this.id
                )
            ),
            React.createElement("td", null, this.name),
            React.createElement("td", null, this.tel),
            React.createElement("td", null, this.url),
            React.createElement("td", null, this.address.city)
        ];
    }
}

class Association {
    constructor(pid, oid) {
        this.pid = pid;
        this.oid = oid;
    }
}

db.person.mapToClass(Person);
db.organisation.mapToClass(Organisation);
db.association.mapToClass(Association)

class Alert extends React.Component {
    render() {
        return React.createElement(
            "div",
            {"className": `alert alert-${this.props.level} alert-dismissible`, "role": "alert"},
            React.createElement(
                "button",
                {"type": "button", "className": "close", "data-dismiss": "alert"},
                React.createElement(
                    "span",
                    null,
                    "\u00D7"
                )
            ),
            this.props.message
        );
    }
}

class StandardForm extends React.Component {
    render() {
        const props = this.props;
        return React.createElement(
            "form",
            {id: props.formid},
            [
                React.createElement(
                    "div",
                    {className: "col-xs-12"},
                    [
                        React.createElement(
                            "div",
                            {className: "input-group input-group-lg"},
                            [
                                React.createElement("span", {className: "input-group-addon"}, "name"),
                                React.createElement("input", {className: "form-control", type: "text", name: "name", defaultValue: props.name}),
                            ]
                        ),
                        React.createElement("br")
                    ]
                ),
                React.createElement(
                    "div",
                    {className: "col-xs-6"},
                    Object.keys(props.address).reduce(function (acc, key) {
                        return acc.concat(
                            [
                                React.createElement(
                                    "div",
                                    {className: "input-group"},
                                    [
                                        React.createElement("span", {className: "input-group-addon"}, key),
                                        React.createElement("input", {className: "form-control", type: "text", name: key, defaultValue: props.address[key]})
                                    ]
                                ),
                                React.createElement("br")
                            ]
                        );
                    }, [])
                ),
                React.createElement(
                    "div",
                    {className: "col-xs-6"},
                    Object.keys(props.misc).reduce(function (acc, key) {
                        return acc.concat(
                            [
                                React.createElement(
                                    "div",
                                    {className: "input-group"},
                                    [
                                        React.createElement("span", {className: "input-group-addon"}, key),
                                        React.createElement("input", {className: "form-control", type: "text", name: key, defaultValue: props.misc[key]})
                                    ]
                                ),
                                React.createElement("br")
                            ]
                        );
                    }, []).concat(
                        React.createElement("input", {type: "hidden", name: "id", defaultValue: props.id}),
                        React.createElement("button", {className: "btn btn-default", type: "submit"}, props.button)
                    )
                )
            ]
        );
    }
}


class StandardTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: []
        };
    }

    componentDidMount() {
        if (this.props.records) {
            this.setState({
                rows: this.props.records
            })
        } else if (this.props.collection) {
            db[this.props.collection].each((record) => {
                this.setState({
                    rows: this.state.rows.concat(record)
                });
            }).catch(function(e) {
                ReactDOM.render(React.createElement(window.Alert, { level: "danger", message: e.message }), document.getElementById("notification-area"));
            });
        }
    }

    render() {
        return React.createElement(
            "table",
            {className: "table table-striped table-bordered"},
            [
                React.createElement(
                    "thead",
                    null,
                    React.createElement(
                        "tr",
                        null,
                        this.props.klass.getColumns().map(function (col) {
                            return React.createElement("td", null, col);
                        })
                    )
                ),
                React.createElement(
                    "tbody",
                    null,
                    this.state.rows.map(function (record) {
                        return React.createElement(
                            "tr",
                            null,
                            record.getRow()
                        );
                    })
                )
            ]
        );
    }
}


/*






        render() {
            return React.createElement(
                "table",
                {className: "table table-striped table-bordered"},
                [
                    React.createElement(
                        "thead",
                        null,
                        React.createElement(
                            "tr",
                            null,
                            [
                                React.createElement("td", null, "#"),
                                React.createElement("td", null, "name"),
                                React.createElement("td", null, "tel"),
                                React.createElement("td", null, "url"),
                                React.createElement("td", null, "city"),
                            ]
                        )
                    ),
                    React.createElement(
                        "tbody",
                        null,
                        this.state.organisations.map(function (org) {
                            return React.createElement(
                                "tr",
                                null,
                                [
                                    React.createElement(
                                        "td",
                                        null,
                                        React.createElement(
                                            "a",
                                            {href: `/organisations/${org.id}`},
                                            org.id
                                        )
                                    ),
                                    React.createElement("td", null, org.name),
                                    React.createElement("td", null, org.tel),
                                    React.createElement("td", null, org.url),
                                    React.createElement("td", null, org.address.city),
                                ]
                            );
                        })
                    )
                ]
            );
        }
    }


if ('content' in document.createElement('template')) {

  // Instantiate the table with the existing HTML tbody and the row with the template
  var t = document.querySelector('#productrow'),
  td = t.content.querySelectorAll("td");
  td[0].textContent = "1235646565";
  td[1].textContent = "Stuff";

  // Clone the new row and insert it into the table
  var tb = document.getElementsByTagName("tbody");
  var clone = document.importNode(t.content, true);
  tb[0].appendChild(clone);

  // Create a new row
  td[0].textContent = "0384928528";
  td[1].textContent = "Acme Kidney Beans";

  // Clone the new row and insert it into the table
  var clone2 = document.importNode(t.content, true);
  tb[0].appendChild(clone2);

} else {
  // Find another way to add the rows to the table because
  // the HTML template element is not supported.
}

const person = new Person("Testy McTestface", "+44 1555 960555", "testy@testface.com", {
    "city": "London",
    "street": "Downing Street",
    "building": "10",
    "dwelling": "",
    "postcode": "SW1A 2AA"
});

person.put();

db.person.where("name").startsWithIgnoreCase("T").each(function(p) {
    console.log(p instanceof Person);
    console.log(p);
}).catch(function (e) {
    console.error(e);
});
*/
/**
One organisation has many people
One person could be in many organisations

A person has a name and contact details
An organisation has a name and contact details
**/