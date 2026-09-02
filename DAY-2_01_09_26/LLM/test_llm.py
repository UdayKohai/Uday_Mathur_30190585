from llm_config import chat_model

response = chat_model.invoke(
    "Generate 6 test cases for an ecommerse login page"
)

print("RESPONSE")
print(response)
print("\nCONTENT:")
print(response.content)
