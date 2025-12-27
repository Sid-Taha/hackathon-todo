import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def run():
    # Configure the server parameters (how to run the mcp-server)
    server_params = StdioServerParameters(
        command="uv",
        args=["run", "mcp-server/main.py"],
        env=None
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # Initialize the session
            await session.initialize()

            # List available tools
            tools = await session.list_tools()
            print("Available tools:", [tool.name for tool in tools.tools])

            # Call get_tasks tool
            token = "3978c8a4-3b48-4366-a908-f49b22710d13"
            print(f"Calling get_tasks with token: {token}")
            
            result = await session.call_tool("get_tasks", arguments={"session_token": token})
            print("\nResult from get_tasks:")
            print(result)

if __name__ == "__main__":
    asyncio.run(run())
