#!/bin/bash
# 用宿主 Electron 内嵌的 Node 运行 JS。
# 原因：PATH 里没有 node，且 resources/runtime/bin/node 依赖未设置的 $DSH_DESKTOP_NODE_EXECUTABLE。
export ELECTRON_RUN_AS_NODE=1
exec "/c/deepseek harness/DeepSeek Harness.exe" --expose-internals "$@"
