
const db = new Dexie("chatdata");

db.version(1).stores({
    chat: "&id,requested_by,created_at,initial_message,agent_id",
    message: "++id,chat_id,date,message,alias,agent_id"
});

class Chat {
    constructor(id, requested_by, created_at, initial_message, agent_id) {
        this.id = id;
        this.requested_by = requested_by;
        this.created_at = created_at;
        this.initial_message = initial_message;
        this.agent_id = agent_id;
    }
}

class Message {
    constructor(chat_id, date, alias, message, agent_id) {
        this.chat_id = chat_id;
        this.date = date;
        this.alias = alias;
        this.message = message;
        this.agent_id = agent_id;
    }
}

db.chat.mapToClass(Chat);
db.message.mapToClass(Message);


const initialState = {
    timeline: [],
    offset: 0,
    selected: null
};

const ACTION_TYPES = {
    ADD_TIMELINE_ITEM: "ADD_TIMELINE_ITEM",
    SET_TIMELINE_ITEMS: "SET_TIMELINE_ITEMS",
    INCR_PAGINATION: "INCR_PAGINATION",
    DECR_PAGINATION: "DECR_PAGINATION",
    SELECT_CHAT: "SELECT_CHAT"
}

const PAGINATION_STEP = 25;

const store = Redux.createStore(function (state=initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.ADD_TIMELINE_ITEM:
            return Object.assign({}, state, {
                timeline: state.timeline.concat(action.data)
            });
        case ACTION_TYPES.SET_TIMELINE_ITEMS:
            return Object.assign({}, state, {
                timeline: action.data
            });
        case ACTION_TYPES.INCR_PAGINATION:
            return Object.assign({}, state, {
                offset: state.offset + PAGINATION_STEP
            });
        case ACTION_TYPES.DECR_PAGINATION:
            if (state.offset > 0) {
                return Object.assign({}, state, {
                    offset: Math.max(0, state.offset - PAGINATION_STEP)
                });
            }
            break;
        case ACTION_TYPES.SELECT_CHAT:
            return Object.assign({}, state, {
                selected: action.data
            });
        case ACTION_TYPES.LOADED_NEW_MESSAGES:
            return Object.assign({}, state, {
                messages: action.data
            });
    } return Object.assign({}, state);
});

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

    static info(message) {
        ReactDOM.render(React.createElement(Alert, {level: "info", message: message}), document.getElementById("notification-column"));
    }

    static danger(message) {
        ReactDOM.render(React.createElement(Alert, {level: "danger", message: message}), document.getElementById("notification-column"));
    }

    static success(message) {
        ReactDOM.render(React.createElement(Alert, {level: "success", message: message}), document.getElementById("notification-column"));
    }
}

class Pagination extends React.Component {
    static incr() {
        store.dispatch({
            type: ACTION_TYPES.INCR_PAGINATION
        });
    }

    static decr() {
        store.dispatch({
            type: ACTION_TYPES.DECR_PAGINATION
        });
    }

    render() {
        let previous = "previous";
        if (!this.props.offset) {
            previous = previous + " disabled";
        }
        return React.createElement(
            "nav",
            null,
            React.createElement(
                "ul",
                {className: "pager"},
                [
                    React.createElement(
                        "li",
                        {className: previous, key: "pagination-previous", onClick: Pagination.decr},
                        React.createElement(
                            "a",
                            {href: "#"},
                            `\u2190 Previous`
                        )
                    ),
                    React.createElement(
                        "li",
                        {className: "next", key: "pagination-next", onClick: Pagination.incr},
                        React.createElement(
                            "a",
                            {href: "#"},
                            `\u2192 Next`
                        )
                    )
                ]
            )
        );
    }
}

class ItemMessages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {messages: []};
    }

    componentDidMount() {
        Alert.info("Getting message transcript from database..");
        db.message.where("chat_id").equals(this.props.chat_id).toArray((messages) => {
            if (!messages.length) {
                Alert.info("No message transcript available");
            } else {
                Alert.success("Message transcript found.");
            }
            this.setState({
                messages: messages.sort(function (a, b) {
                    return a.date - b.date;
                })
            });
        }).catch(function (e) {
            Alert.danger(e.message);
        });
    }

    render() {
        return React.createElement(
            "div",
            null,
            this.state.messages.map(function (message, index) {
                const side = message.agent_id ? "right" : "left";
                return React.createElement(
                    "p",
                    {className: `cb cb-${side}`, key: `cb-${index}`},
                    message.message
                );
            })
        );
    }
}

class TimelineItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let element = undefined;
        if (this.props.selected && this.props.selected === this.props.record.id) {
            element = React.createElement(ItemMessages, {chat_id: this.props.record.id, key: `msgs-${this.props.record.id}`});
        } else {
            element = React.createElement(
                    "button",
                    {
                        type: "button",
                        className: "btn btn-default",
                        key: `btn-${this.props.record.id}`,
                        onClick: () => {
                            store.dispatch({
                                type: ACTION_TYPES.SELECT_CHAT,
                                data: this.props.record.id
                            })
                        }
                    },
                    "Show messages"
                );
        }

        return React.createElement(
            "div",
            {className: "timeline-item"},
            [
                React.createElement(
                    "div",
                    {
                        className: "timeline-item-info",
                        key: `info-${this.props.record.id}`
                    },
                    `${this.props.record.requested_by} @ ${(new Date(this.props.record.created_at)).toString()} with ${this.props.record.agent_id || "unassigned"}`
                ),
                React.createElement(
                    "blockquote",
                    {
                        className: "timeline-item-message",
                        key: `message-${this.props.record.id}`
                    },
                    this.props.record.initial_message
                ),
                element
            ]
        )
    }
}

class Timeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = store.getState();
        this.unsubscribe = null;
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            this.setState(store.getState());
        });

        db.chat.orderBy("created_at").reverse().toArray(function (records) {
            return store.dispatch({type: ACTION_TYPES.SET_TIMELINE_ITEMS, data: records});
        }).catch(function(e) {
            Alert.danger(e.message);
        });

    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return React.createElement(
            "div",
            null,
            [
                React.createElement(Pagination, {id: "pagination", key: "pagination", offset: this.state.offset}),
                React.createElement(
                    "section",
                    {id: "timeline", key: "timeline"},
                    this.state.timeline.slice(this.state.offset, this.state.offset + PAGINATION_STEP).map((record, index) => {
                        return React.createElement(TimelineItem, {record: record, selected: this.state.selected, key: `timeline-item-${this.state.offset + index}`});
                    })
                )
            ]
        );
    }
}

function handle_dataset_reload(evt) {
    fetch("chatdata.json").then(function (res) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return res.json().then(function (records) {
                Alert.info("Started processing dataset, this may take quit a while...");
                const message_promises = [];
                let resolved = 0;
                return db.chat.bulkPut(
                    records.filter(function(record) {
                        return record.type === "chat";
                    }).map(function (record) {
                        const agent_id = record.transcript.reduce(function (agent_id, msg) {
                            message_promises.push(
                                db.message.put(new Message(record.id, msg.date, msg.alias, msg.message, msg.id)).then(function () {
                                    resolved++;
                                }).catch(function(e) {
                                    Alert.danger(e.message);
                                })
                            );
                            if (msg.id) {
                                return msg.id;
                            }
                            return agent_id;
                        }, undefined);
                        return new Chat(record.id, record.requested_by, record.created_at, record.initial_message, agent_id);
                    })
                ).then(function () {
                    Alert.info(`Now processing transcripts (${resolved} / ${message_promises.length}) you can now view the timeline.`);
                    let iv = window.setInterval(function () {
                        Alert.info(`Now processing transcripts (${resolved} / ${message_promises.length}) you can now view the timeline.`);
                    }, 1000);
                    Dexie.Promise.all(message_promises).then(function () {
                        window.clearInterval(iv);
                        Alert.success("Finished importing dataset to database!");
                    }).catch(function (e) {
                        Alert.danger(e.message);
                    });
                });
            })
        } throw new Error(`${res.status} ${res.statusText}`);
    }).catch(function(e) {
        Alert.danger(e.message);
    });
}