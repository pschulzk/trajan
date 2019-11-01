import { BinaryField } from './node.model';

export interface Receipt {
    content: string;
    gallery: Gallery[];
    name: string
    text_teaser: string;
    thumbnail: BinaryField;
}

export interface Gallery {
    uuid: string;
}


// MESH MODEL JSON
/*
{
    "name": "Rezept",
    "container": false,
    "autoPurge": false,
    "displayField": "name",
    "segmentField": "name",
    "urlFields": [
        "name"
    ],
    "fields": [
        {
            "name": "content",
            "type": "string",
            "label": "Inhalt",
            "required": true
        },
        {
            "name": "gallery",
            "type": "list",
            "label": "Bildergallerie",
            "required": false,
            "listType": "node",
            "allow": [
                "binary_content"
            ]
        },
        {
            "name": "name",
            "type": "string",
            "label": "Name",
            "required": true
        },
        {
            "name": "text_teaser",
            "type": "string",
            "label": "Vorschautext",
            "required": false
        },
        {
            "name": "thumbnail",
            "type": "binary",
            "label": "Rezeptbild",
            "required": false
        }
    ]
}
*/
