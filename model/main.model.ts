import React from 'react';

export type Update = {
    type: string,
    chat_id: string,
    new_message: {
        message_id: string,
        text: string,
        time: string,
        is_edited: boolean,
        sender_type: string,
        sender_id: string,
        aux_data: {
            start_id: string | null,
            button_id: string,
        }

    }
}


export type InlineMessage = {
    sender_id: string
    text: string
    location: string | null,
    aux_data: {
        start_id: string | null,
        button_id: string
    },
    message_id: string
    chat_id: string
}
