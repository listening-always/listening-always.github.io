#!/usr/bin/python
# -*- coding: utf-8 -*-

import json
import re
import codecs
import operator
from collections import OrderedDict

ABBRS = r"[FM]+4?[FMA]+|DP|BJ|GFE|CBT|JOI|MD|LB|DD|LG|FSub|MDom|LA"
filters = [
    {"match": r"\[[\[\s]*.+?\]", "replace": " "}, # Attempt to remove every tag from the title
    {"match": r" {2,}",          "replace": " "}, # Strip out multiple spaces
    {"match": r"\d+[:.]\d+",     "replace": ""}  # Strip out durations
]
# Super sikrit sauce:
# On soundgasm link list: 
# copy(JSON.stringify(Array.from($(".sound-details a").map((idx, item) => ({link: item.href, title: item.text})))))
def get_data():
    with codecs.open("data.json", "r", "utf-8-sig") as file:
        data = json.loads(file.read())

    links = []
    tags = dict()
    # TODO: We might be better off trying to parse this as a list of tokens, so as to prevent picking up anything after 
    # brackets. This might also prevent us from doing nasty regex hacks.
    for item in data:
        # Retrieve the tag list for each link
        split_tags = [re.sub(r" +", " ", tag) for tag in re.findall(r"\[[\[\s]*(.+?)\]", item["title"])]
        # Titlecase tags, skipping genders
        for i in range(0, len(split_tags)):
            if re.search(ABBRS, split_tags[i]) is None:
                split_tags[i] = split_tags[i].title()

        title = item["title"]
        for f in filters:
            title = re.sub(f['match'], f['replace'], title)
        title = title.strip()
        if title == "":
            title = item["title"]

        # Add a "No tag" tag if there are none
        if len(split_tags) == 0:
            split_tags.append("No tag")

        # Write/update tag list
        for tag in split_tags:
            if tag not in tags.keys():
                tags[tag] = 1
            else:
                tags[tag] = tags[tag] + 1


        # Write audio list
        current = dict()
        current["link"] = item["link"]
        current["title"] = title
        current["tags"] = split_tags
        links.append(current)

    # Sort the tags alphabetically
    with codecs.open("js/audios.js", "w", "utf-8-sig") as audios_file:
        audios_file.write("var audios = ")
        json.dump(links, audios_file, indent=2)
    with codecs.open("js/tags.js", "w", "utf-8-sig") as tags_file:
        tags_file.write("var tags = ")
        json.dump(tags, tags_file, indent=2)

get_data()
