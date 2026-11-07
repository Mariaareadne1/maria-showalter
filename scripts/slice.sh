#!/bin/sh
# slice.sh <image> <outprefix> [sliceHeight]  — split a tall screenshot into viewable 720px-wide slices
FF=${FFMPEG:-$HOME/Developer/FrameFlow/node_modules/ffmpeg-static/ffmpeg}
FP=$HOME/Developer/FrameFlow/node_modules/ffprobe-static/bin/darwin/arm64/ffprobe
H=$($FP -v error -select_streams v -show_entries stream=height -of csv=p=0 "$1"); W=$($FP -v error -select_streams v -show_entries stream=width -of csv=p=0 "$1")
S=${3:-2400}; i=0; y=0
while [ $y -lt $H ]; do h=$S; [ $((y+h)) -gt $H ] && h=$((H-y)); $FF -loglevel error -y -i "$1" -vf "crop=$W:$h:0:$y,scale=720:-2" -q:v 3 "$2$i.jpg"; i=$((i+1)); y=$((y+S)); done
echo "$i slices ($W x $H)"
