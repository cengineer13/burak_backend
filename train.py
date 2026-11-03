# print("============== TASK K ==============")
# print("""Berilayotgan parametr tarkibida nechta unli harf bor ekanligini aniqlovchi function tuzing.
# Masalan: countVowels("string") return 1
# """)
# vowels = ["a", "e", "i", "o", "u"]


# def countVowels(word):
#     count = 0
#     for letter in word.lower():
#         if letter in vowels:
#             count += 1
#     return count


# word_k = "Stringa"
# result_k = countVowels(word_k)
# print(f"Natija: {word_k} so'zida {result_k} ta unli qatnashgan.")
# print("\n")


# print("============== TASK L ==============")
# print("""So'zlarni ketma-ketligini buzmasdan har bir so'zni alohida teskarisiga o'girib beradigan function tuzing.
# Masalan: reverseSentence("we like coding!") return "ew ekil !gnidoc
# """)


# def reverseSentence(sentence):
#     array = sentence.split()  # str -> array
#     reversed_array = [word[::-1]
#                       for word in array]  # reverse each words via loop
#     return " ".join(reversed_array)  # reversed array -> string


# sentence = "We like coding!"
# result_l = reverseSentence(sentence)
# print(
#     f"Natija: {sentence} ==> teskari natijasi ==>: {result_l} ")
# print("\n")


print("============== TASK V ==============")
print("""Stringdagi har bir harf necha marta takrorlanganini object sifatida qaytarsin.
Masalan: countChars("hello") return {h: 1, e: 1, l: 2, o: 1}\n""")


def countChars(string):
    new_dict = {}
    i = 1
    for letter in string:
        new_dict[letter] = new_dict.get(letter, 0) + 1
    return new_dict
char_v = "hello"
result_v = countChars(char_v)
print(f"{char_v} so'zida harflarning qaytarilish natijasi: {result_v}\n")

print("============== TASK W ==============")
print("""Arrayni berilgan uzunlikda bo'laklarga ajratib qaytarsin.
Masalan: chunkArray([1, 2, 3, 4, 5], 2) return [[1, 2], [3, 4], [5]]\n""")

def chunkArray(array:list, size:int):
    if size <=0:
        return 0
    return [array[i:i+size] for i in range(0, len(array), size)]

array_w = [1, 2, 3, 4, 5]
result_w = chunkArray(array_w, 3)
print(f"{array_w} bo'laklarga bo'linganda natija {result_w}\n" )

