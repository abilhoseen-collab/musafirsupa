FROM node:18-alpine

WORKDIR /app

# প্যাকেজ ফাইল কপি করুন
COPY package*.json ./

# নির্ভরতা ইনস্টল করুন
RUN npm ci --only=production

# অ্যাপ্লিকেশন কপি করুন
COPY ./src ./src

# পোর্ট এক্সপোজ করুন
EXPOSE 5000

# স্বাস্থ্য পরীক্ষা
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# সার্ভার শুরু করুন
CMD ["node", "server.js"]