<template>
  <div>
    <a-row type="flex" justify="center" align="middle" style="margin-top:32px">
      <a-col class="back-plate">
        <a-row
          type="flex"
          justify="space-between"
          class="top-menu"
          align="middle"
        >
          <a-col :span="12" class="top-left">2048</a-col>
          <a-col :span="12" class="top-right">
            <a-row type="flex" :gutter="4">
              <a-col :span="12">
                <div class="top-box">
                  <div class="title">SCORE</div>
                  <div class="subtitle">{{ score }}</div>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="top-box">
                  <div class="title">BEST</div>
                  <div class="subtitle">{{ best }}</div>
                </div>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row type="flex" justify="space-between">
          <a-col
            ><p class="developed-by">Developed by <b>Rafet Topçu</b></p></a-col
          >
          <a-col style="cursor:pointer;">
            <a-button
              type="link"
              style="color:black !important"
              @click="replay"
              size="small"
              >Restart</a-button
            >
          </a-col>
        </a-row>

        <div class="plate">
          <a-row
            type="flex"
            align="middle"
            v-for="(row, index) in grid"
            :key="index + 'row'"
          >
            <a-col
              class="cell-s"
              v-for="(cell, ind) in row"
              :key="ind"
              :style="{
                background: colors[cell].back + '!important',
                color: colors[cell].text
              }"
              ><p>{{ cell > 0 ? cell : '' }}</p>
            </a-col>
          </a-row>
          <a-row
            v-if="isEnd"
            justify="center"
            type="flex"
            align="middle"
            class="end-panel"
          >
            <a-col>
              <center>
                <p>GAME OVER</p>
                <a-button shape="round" ghost @click="replay"
                  >Play again</a-button
                >
              </center>
            </a-col>
          </a-row>
        </div>
        <span style="opacity:.6"
          >You can play with <kbd>W</kbd>,<kbd>A</kbd>,<kbd>S</kbd>,<kbd>D</kbd>
        </span>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { transpose } from 'mathjs';

export default {
  data() {
    return {
      grid: [],
      gridSize: 4,
      score: 0,
      best: 0,
      colors: {
        0: { back: '', text: '' },
        2: { back: '#EEE4DA', text: '#776F64' },
        4: { back: '#ECE0CA', text: '#776F64' },
        8: { back: '#F2B178', text: '#fff' },
        16: { back: '#EC8D53', text: '#fff' },
        32: { back: '#F57C5F', text: '#fff' },
        64: { back: '#E95839', text: '#fff' },
        128: { back: '#F3D96B', text: '#fff' },
        256: { back: '#F1D04B', text: '#fff' },
        512: { back: '#E4C029', text: '#fff' }
      }
    };
  },
  mounted() {
    window.addEventListener(
      'keypress',
      function(e) {
        const key = String.fromCharCode(e.keyCode);
        if (key === 'a' || key === 'A') {
          this.moveLeft();
        }
        if (key === 'd' || key === 'D') {
          this.moveRight();
        }
        if (key === 'w' || key === 'W') {
          this.moveUp();
        }
        if (key === 's' || key === 'S') {
          this.moveDown();
        }
      }.bind(this)
    );
  },

  watch: {
    score(val) {
      if (val > this.best) {
        this.best = val;
        this.$localStorage.set('best', val);
      }
    }
  },
  methods: {
    replay() {
      this.score = 0;
      this.grid = [];
      this.best = this.$localStorage.get('best');
      for (let i = 0; i < this.gridSize; i++) {
        this.grid.push(new Array(this.gridSize).fill(0));
      }
      this.spawnNew();
      this.spawnNew();
    },
    spawnNew() {
      if (
        this.grid
          .map(row => {
            return row.filter(x => x === 0).length;
          })
          .filter(x => x > 0).length === 0
      )
        return;
      let row = Math.floor(Math.random() * this.gridSize);
      let col = Math.floor(Math.random() * this.gridSize);
      while (this.grid[row][col] !== 0) {
        row = Math.floor(Math.random() * this.gridSize);
        col = Math.floor(Math.random() * this.gridSize);
      }
      this.grid[row][col] = 2;
    },
    moveRight() {
      let changed = true;
      for (let i = 0; i < this.gridSize; i++) {
        let filtered = this.grid[i].filter(x => x !== 0);

        let k = filtered.length - 1;
        while (k >= 0) {
          if (filtered[k] === filtered[k - 1]) {
            filtered[k] *= 2;
            filtered[k - 1] = 0;
            this.score += filtered[k];
          }
          k -= 1;
        }
        filtered = filtered.filter(x => x !== 0);
        while (filtered.length < this.gridSize) filtered = [0].concat(filtered);
        this.$set(this.grid, i, filtered);
      }
      if (changed) this.spawnNew();
      return changed;
    },
    moveLeft() {
      let changed = true;
      for (let i = 0; i < this.gridSize; i++) {
        let filtered = this.grid[i].filter(x => x !== 0);
        let k = 0;
        while (k < filtered.length) {
          if (filtered[k] === filtered[k + 1]) {
            filtered[k] *= 2;
            filtered[k + 1] = 0;
            this.score += filtered[k];
          }
          k += 1;
        }
        filtered = filtered.filter(x => x !== 0);
        while (filtered.length < this.gridSize) filtered.push(0);
        this.$set(this.grid, i, filtered);
      }
      if (changed) this.spawnNew();
      return changed;
    },
    moveUp() {
      const T = transpose(this.grid);
      T.map((row, index) => {
        this.$set(this.grid, index, row);
      });
      let changed = this.moveLeft();
      transpose(this.grid).map((row, index) => {
        this.$set(this.grid, index, row);
      });
      if (changed) this.spawnNew();
    },
    moveDown() {
      const T = transpose(this.grid);
      T.map((row, index) => {
        this.$set(this.grid, index, row);
      });
      let changed = this.moveRight();
      transpose(this.grid).map((row, index) => {
        this.$set(this.grid, index, row);
      });
      if (changed) this.spawnNew;
    }
  },
  computed: {
    isEnd() {
      let end = true;
      for (let i = 0; i < this.grid.length; i++) {
        for (let j = 0; j < this.grid[i].length - 1; j++) {
          if (
            this.grid[i][j] === this.grid[i][j + 1] ||
            this.grid[i][j] === 0 ||
            this.grid[i][j + 1] === 0
          ) {
            end = false;
          }
        }
      }
      for (let i = 0; i < this.grid.length - 1; i++) {
        for (let j = 0; j < this.grid[i].length; j++) {
          if (
            this.grid[i][j] === this.grid[i + 1][j] ||
            this.grid[i][j] === 0 ||
            this.grid[i + 1][j] === 0
          ) {
            end = false;
          }
        }
      }
      return end;
    }
  },
  created() {
    this.best = this.$localStorage.get('best');
    for (let i = 0; i < this.gridSize; i++) {
      this.grid.push(new Array(this.gridSize).fill(0));
    }
    this.spawnNew();
    this.spawnNew();
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Kdam+Thmor&family=Sen:wght@700&display=swap');
body {
  background: #ecf0f1 !important;
}
.back-plate {
  font-family: 'Sen', sans-serif;
  background: #fbf8f1;
  padding: 28px;
  border-radius: 4px;
}
.top {
  width: 80px;
}
.cell-s {
  padding: 0;
  margin: 0;
  width: 80px;
  height: 80px;
  text-align: center;
  background: #ccc0b4;
  border-radius: 2px;
  margin: 4px;
  transition: background 0.25s;
}

.cell-s p {
  text-align: center;
  vertical-align: middle;
  line-height: 80px;
  font-size: 22px;
}
.cell-text-dark {
  color: #786e64;
}
.cell-text-light {
  color: white;
}
.cell:hover {
  opacity: 0.5;
}
.plate {
  background: #bbada0;
  padding: 8px;
  border-radius: 4px;

  color: white;
}
.top-menu {
  margin: 20px 0;
}
.top-left {
  font-size: 64px;
}
.top-right {
}
.top-box {
  background: #bbada0;

  text-align: center;
  border-radius: 4px;
  color: #fdf6ef;
}
.top-box .title {
  font-size: 12px;
}
.top-box .subtitle {
  margin-top: -4px;
  font-size: 20px;
  color: white;
}
.developed-by {
  font-family: Roboto, sans-serif;
  opacity: 0.7;
}
.end-panel {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  padding: 28px;
  border-radius: 4px;
  background: #000000aa;

  transition: background 0.3s;
  font-size: 50px;
}
</style>
