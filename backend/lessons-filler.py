import sqlite3
import os
import json

def read_json_files_from_folder(directory):
    json_data = []
    
    # Получаем список файлов, сортируем их по алфавиту
    files = sorted(f for f in os.listdir(directory) if f.endswith(".json"))
    
    for file in files:
        file_path = os.path.join(directory, file)
        with open(file_path, "r", encoding="utf-8") as f:
            json_data.append(f.read())  # Читаем содержимое файла в строку
    
    return json_data


def add_lessons():
    conn = sqlite3.connect("lessons.db")
    cursor = conn.cursor()
    

    


    cursor.execute("""
        DELETE FROM Lessons
    """)


    
    data_en = read_json_files_from_folder('../lessons/en')
    data_de = read_json_files_from_folder('../lessons/de')
    data_en_chal = read_json_files_from_folder('../lessons/en-chall')
    data_de_chal = read_json_files_from_folder('../lessons/de-chall')

    metadata_en = [[1, 'en', 'Introducing Yourself and Others', 'Talking About Yourself (Name, Age, Occupation, Hobbies)', data_en[0]], 
                [2, 'en', 'Introducing Yourself and Others', 'Describing Your Family and Friends', data_en[1]],
                [3, 'en', 'Introducing Yourself and Others', 'Making First Impressions', data_en[2]],                
                [4, 'en', 'Daily Routines and Lifestyle', 'Talking About Work and School', data_en[3]],
                [5, 'en', 'Daily Routines and Lifestyle', 'Describing Hobbies and Free Time Activities', data_en[4]],
                [6, 'en', 'Daily Routines and Lifestyle', 'Discussing Healthy Habits and Routines', data_en[5]],
                [7, 'en', 'Travel and Transportation', 'Planning a Trip and Making Reservations', data_en[6]],
                [8, 'en', 'Travel and Transportation', 'Giving and Asking for Directions', data_en[7]],
                [9, 'en', 'Travel and Transportation', 'Talking About Different Modes of Transport', data_en[8]],
                [10, 'en', 'Food and Cooking', 'Describing Dishes and Ingredients', data_en[9]],
                [11, 'en', 'Food and Cooking', 'Ordering at Restaurants', data_en[10]],
                [12, 'en', 'Food and Cooking', 'Discussing Culinary Cultures', data_en[11]]
    ]

    metadata_en_chall = [[100001, 'en', 'daily_challenge', 'daily_challenge', data_en_chal[0]], 
                [100002, 'en', 'daily_challenge', 'daily_challenge', data_en_chal[1]],
                [100003, 'en', 'daily_challenge', 'daily_challenge', data_en_chal[2]],                
    ]

    metadata_de_chall = [[100004, 'de', 'daily_challenge', 'daily_challenge', data_de_chal[0]], 
                [100005, 'de', 'daily_challenge', 'daily_challenge', data_de_chal[1]],
                [100006, 'de', 'daily_challenge', 'daily_challenge', data_de_chal[2]],                
    ]

    metadata_de = [
            [13, 'de', 'Sich selbst und andere vorstellen', 'Über sich selbst sprechen (Name, Alter, Beruf, Hobbys)', data_de[0]], 
            [14, 'de', 'Sich selbst und andere vorstellen', 'Über deine Familie und Freunde sprechen', data_de[1]],
            [15, 'de', 'Sich selbst und andere vorstellen', 'Einen ersten Eindruck machen', data_de[2]],                
            [16, 'de', 'Tagesabläufe und Lebensstil', 'Über Arbeit und Schule sprechen', data_de[3]],
            [17, 'de', 'Tagesabläufe und Lebensstil', 'Hobbys und Freizeitaktivitäten beschreiben', data_de[4]],
            [18, 'de', 'Tagesabläufe und Lebensstil', 'Gesunde Gewohnheiten und Routinen besprechen', data_de[5]],
            [19, 'de', 'Reisen und Transport', 'Eine Reise planen und Reservierungen machen', data_de[6]],
            [20, 'de', 'Reisen und Transport', 'Wegbeschreibungen geben und nach dem Weg fragen', data_de[7]],
            [21, 'de', 'Reisen und Transport', 'Über verschiedene Verkehrsmittel sprechen', data_de[8]],
            [22, 'de', 'Essen und Kochen', 'Gerichte und Zutaten beschreiben', data_de[9]],
            [23, 'de', 'Essen und Kochen', 'Im Restaurant bestellen', data_de[10]],
            [24, 'de', 'Essen und Kochen', 'Kulinarische Kulturen besprechen', data_de[11]]
]






    for metadata in metadata_en:
        cursor.execute("""
                        INSERT INTO Lessons (lesson_id, language, topic, title, data)
                        VALUES (?, ?, ?, ?, ?)
                    """, (metadata[0], metadata[1], metadata[2], metadata[3], metadata[4]))

    for metadata in metadata_de:
        cursor.execute("""
                        INSERT INTO Lessons (lesson_id, language, topic, title, data)
                        VALUES (?, ?, ?, ?, ?)
                    """, (metadata[0], metadata[1], metadata[2], metadata[3], metadata[4]))

    for metadata in metadata_en_chall:
        cursor.execute("""
                        INSERT INTO Lessons (lesson_id, language, topic, title, data)
                        VALUES (?, ?, ?, ?, ?)
                    """, (metadata[0], metadata[1], metadata[2], metadata[3], metadata[4]))

    for metadata in metadata_de_chall:
        cursor.execute("""
                        INSERT INTO Lessons (lesson_id, language, topic, title, data)
                        VALUES (?, ?, ?, ?, ?)
                    """, (metadata[0], metadata[1], metadata[2], metadata[3], metadata[4]))




   
    conn.commit()
    conn.close()
    print("Data added successfully!")




add_lessons()


