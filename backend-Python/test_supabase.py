from supabase import create_client
import asyncio

async def test():
    try:
        supabase = create_client("https://invalid-url-that-does-not-exist.supabase.co", "dummy_key")
        res = supabase.table("documents").select("*").execute()
        print(res)
    except Exception as e:
        print(f"Error with invalid url: {repr(e)}")

    try:
        supabase2 = create_client("", "dummy_key")
        res2 = supabase2.table("documents").select("*").execute()
        print(res2)
    except Exception as e:
        print(f"Error with empty url: {repr(e)}")

asyncio.run(test())
