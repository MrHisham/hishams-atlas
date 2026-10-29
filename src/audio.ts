export class Ambience {
    context: AudioContext | null = null;
    source: AudioBufferSourceNode | null = null;
    gain: GainNode | null = null;
    async play(kind: string, volume: number) { await this.stop(); if (kind === 'Off')
        return; const ctx = new AudioContext(); this.context = ctx; await ctx.resume(); const buffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate), a = buffer.getChannelData(0); let last = 0; for (let i = 0; i < a.length; i++) {
        const n = Math.random() * 2 - 1;
        last = .985 * last + .015 * n;
        a[i] = kind === 'Wind' ? last * 3 : kind === 'Fireplace' ? n * .05 + (Math.random() < .001 ? n * .8 : 0) : n * .22;
    } this.source = ctx.createBufferSource(); this.source.buffer = buffer; this.source.loop = true; this.gain = ctx.createGain(); this.gain.gain.value = volume / 100; this.source.connect(this.gain).connect(ctx.destination); this.source.start(); }
    setVolume(v: number) { if (this.gain)
        this.gain.gain.value = v / 100; }
    async stop() { if (this.source) {
        this.source.stop();
        this.source.disconnect();
        this.source = null;
    } if (this.context) {
        await this.context.close();
        this.context = null;
    } this.gain = null; }
}
