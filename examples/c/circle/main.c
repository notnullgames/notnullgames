#include "null0.h"

int main() {
  printf("Hello!\n");
  return 0;
}

void update() {
  clear(BLACK);
  draw_circle(SCREEN_WIDTH/2, SCREEN_HEIGHT/2, SCREEN_HEIGHT/2 - 20, BLUE);
}