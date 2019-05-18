funct = str(input())

def mapper():
  val, rl1, rh1, rl2, rh2 = [int(n) for n in input().split(', ')]
  percent = (val-rl1)/(rh1-rl1)
  mapped = (percent*(rh2 - rl2))+rl2
  print(mapped)

def bitor():
  byt1, byt2 = [int(n) for n in input().split(', ')]
  out = (byt1 | byt2).to_bytes(8, 'big')
  print(out) #or something

def bitand():
  byt1, byt2 = [int(n) for n in input().split(', ')]
  print(byt1 & byt2)

def midMap():
  val, mid = [int(n) for n in input().split(', ')]
  if val > mid:
    val = 127 + ((val - mid)/(255 - mid) * 128)
    print(val)


if funct == 'mapper' or funct == 'map' or funct == 'm':
  mapper()
elif funct == 'bitor' or funct == 'or':
  bitor()
elif funct == 'bitand' or funct == 'and':
  bitand()
elif funct == 'midMap':
  midMap()