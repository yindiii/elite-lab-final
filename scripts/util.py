import requests
import json

ROOT_URL = 'http://127.0.0.1:5000'
headers = {'Content-type': 'application/json'}


def print_formatted_response(response):
    """
    Helper function to pretty print the response object
    """
    print("Response Status Code: " + str(response.status_code))
    print("Response data: " + response.text)

def call_create_message_api(body):
    print("Calling the CreateMessage API...")
    url = ROOT_URL + '/messages/'
    response = requests.post(
        url,
        data=json.dumps(body),
        headers=headers
    )
    print_formatted_response(response)
    return response.json()

def call_delete_message_api(id):
    print("Calling the DeleteMessage API...")
    url = ROOT_URL + '/messages/' + str(id)
    response = requests.delete(url)
    print_formatted_response(response)

def call_delete_all_message_api():
    print("Deleting all Messages...")
    url = ROOT_URL + '/messages/'
    response = requests.get(url)
    for message in response.json()['messages']:
        call_delete_message_api(message['id'])
        print("Deleted message ID: " + str(message['id']))


if __name__ == '__main__':
    request_body_1 = {
        "username": "johndoe",
        "content": "hey its me",
        "chat_id": "mainchat"
    }
    request_body_2 = {
        "username": "janedoe",
        "content": "hey its also me",
        "chat_id": "mainchat"
    }

    call_create_message_api(request_body_1)
    call_create_message_api(request_body_2)

    call_delete_all_message_api()