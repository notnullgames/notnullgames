#include "null0.h"

u32 logo;
Dimensions* dim;

int main() {
  logo = load_image("logo.png");
  dim = measure_image(logo);
  return 0;
}

void update() {
  clear(BLACK);
  draw_image(logo, SCREEN_WIDTH / 2 - dim->width/2, SCREEN_HEIGHT / 2 - dim->height/2);
}