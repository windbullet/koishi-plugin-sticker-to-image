import { Context, Schema, h } from 'koishi'

export const name = 'sticker-to-image'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.command("表情转图片")
    .action(async ({ session }) => {
      if (session.quote === undefined) {
        await session.send("请在30秒内发送表情")
        let sticker = await session.prompt(30000)
        if (!sticker.includes("img"))
          return "这看上去不是表情"
        if (sticker !== undefined) {
          return sticker
        }
        
      } else {
        if (!session?.quote?.content.includes("img"))
          return "这看上去不是表情"
        return session?.quote?.content
      }
    })
}
