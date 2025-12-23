@echo off
:: 设置代理（仅在这个脚本运行时生效，不会污染全局环境变量）
set HTTP_PROXY=http://127.0.0.1:7890
set HTTPS_PROXY=http://127.0.0.1:7890


:: 启动 Claude Code
claude


