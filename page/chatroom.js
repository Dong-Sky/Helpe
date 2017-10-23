
import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';

class chatroom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {messages: []};
    this.onSend = this.onSend.bind(this);
  }
  componentWillMount() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello!my name is '+params.item.name.first,
          createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
          user: {
            _id: 2,
            name: params.item.name.first,
            avatar: params.item.picture.thumbnail,
          },
        },
      ],
    });
  }
  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }
  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        user={{
          _id: 1,
        }}
      />
    );
  }
}

export default chatroom;
