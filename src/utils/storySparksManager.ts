import { StoryImage } from '../types';
import { STORY_IMAGES_REPOSITORY, IMAGE_CATEGORIES, ImageCategory } from '../data/storyImagesData';

const CUSTOM_SPARKS_KEY = 'the_write_magic_custom_sparks';
const UPDATED_SPARKS_KEY = 'the_write_magic_updated_sparks';
const DELETED_SPARKS_KEY = 'the_write_magic_deleted_sparks';
const FAVORITES_KEY = 'the_write_magic_fav_images';
const SPARK_STATS_KEY = 'the_write_magic_spark_stats';

interface SparkStats {
  [sparkId: string]: {
    timesSelected: number;
    studentIds: string[];
  };
}

class StorySparksManager {
  private getCustomSparks(): StoryImage[] {
    try {
      const data = localStorage.getItem(CUSTOM_SPARKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private getUpdatedSparks(): Record<string, Partial<StoryImage>> {
    try {
      const data = localStorage.getItem(UPDATED_SPARKS_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  private getDeletedSparkIds(): string[] {
    try {
      const data = localStorage.getItem(DELETED_SPARKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private getStats(): SparkStats {
    try {
      const data = localStorage.getItem(SPARK_STATS_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  public getAllSparks(): StoryImage[] {
    const deletedIds = new Set(this.getDeletedSparkIds());
    const updatedMap = this.getUpdatedSparks();
    const customSparks = this.getCustomSparks();
    const stats = this.getStats();

    // Base curated sparks merged with updates and filtered from deletes
    const baseSparks = STORY_IMAGES_REPOSITORY.filter((s) => !deletedIds.has(s.id)).map((s) => {
      const updates = updatedMap[s.id] || {};
      const stat = stats[s.id] || { timesSelected: 0, studentIds: [] };
      return {
        ...s,
        ...updates,
        timesSelected: (updates.timesSelected ?? s.timesSelected ?? 0) + stat.timesSelected,
        uniqueStudentsCount: stat.studentIds.length,
      };
    });

    // Custom sparks created by Admin
    const filteredCustom = customSparks.filter((s) => !deletedIds.has(s.id)).map((s) => {
      const updates = updatedMap[s.id] || {};
      const stat = stats[s.id] || { timesSelected: 0, studentIds: [] };
      return {
        ...s,
        ...updates,
        timesSelected: (updates.timesSelected ?? s.timesSelected ?? 0) + stat.timesSelected,
        uniqueStudentsCount: stat.studentIds.length,
      };
    });

    return [...filteredCustom, ...baseSparks];
  }

  public getSparkById(id: string): StoryImage | undefined {
    return this.getAllSparks().find((s) => s.id === id);
  }

  public getCategories(): ImageCategory[] {
    return IMAGE_CATEGORIES;
  }

  public getSparksByCategory(categoryId: string): StoryImage[] {
    const all = this.getAllSparks();
    if (!categoryId || categoryId === 'all') return all;
    return all.filter((s) => s.category === categoryId);
  }

  public searchSparks(query: string, categoryId?: string): StoryImage[] {
    const sparks = this.getSparksByCategory(categoryId || 'all');
    const q = query.trim().toLowerCase();
    if (!q) return sparks;

    return sparks.filter((s) => {
      const inTitle = s.title.toLowerCase().includes(q);
      const inPrompt = s.prompt.toLowerCase().includes(q);
      const inTag = s.tag.toLowerCase().includes(q);
      const inWords = s.suggestedWords.some((w) => w.toLowerCase().includes(q));
      const inQuestions = s.guidedQuestions?.some((g) => g.toLowerCase().includes(q)) || false;
      const inEmotions = s.suggestedEmotions?.some((e) => e.toLowerCase().includes(q)) || false;
      return inTitle || inPrompt || inTag || inWords || inQuestions || inEmotions;
    });
  }

  public getRandomSpark(categoryId?: string): StoryImage {
    const pool = this.getSparksByCategory(categoryId || 'all');
    if (pool.length === 0) return STORY_IMAGES_REPOSITORY[0];
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }

  public addCustomSpark(spark: Partial<StoryImage> & { title: string; imageUrl: string; prompt: string; category: string }): StoryImage {
    const custom = this.getCustomSparks();
    const newSpark: StoryImage = {
      id: spark.id || `custom-spark-${Date.now()}`,
      title: spark.title,
      imageUrl: spark.imageUrl,
      prompt: spark.prompt,
      category: spark.category,
      categoryLabel: spark.categoryLabel || 'Creative Story',
      tag: spark.tag || 'Spark',
      emoji: spark.emoji || '✨',
      starterSentence: spark.starterSentence,
      guidedQuestions: spark.guidedQuestions,
      suggestedWords: spark.suggestedWords || ['curious', 'adventure', 'magical'],
      suggestedEmotions: spark.suggestedEmotions,
      shortDescription: spark.shortDescription,
      isFeatured: spark.isFeatured || false,
      approvedStatus: 'approved',
      timesSelected: 0,
      uniqueStudentsCount: 0,
    };
    custom.unshift(newSpark);
    localStorage.setItem(CUSTOM_SPARKS_KEY, JSON.stringify(custom));
    return newSpark;
  }

  public addSpark(spark: Partial<StoryImage> & { title: string; imageUrl: string; prompt: string; category: string }): StoryImage {
    return this.addCustomSpark(spark);
  }

  public updateSpark(sparkOrId: StoryImage | string, partial?: Partial<StoryImage>): void {
    let spark: StoryImage | undefined;
    if (typeof sparkOrId === 'string') {
      const existing = this.getSparkById(sparkOrId);
      if (!existing) return;
      spark = { ...existing, ...partial };
    } else {
      spark = partial ? { ...sparkOrId, ...partial } : sparkOrId;
    }

    // If in custom, update in custom
    const custom = this.getCustomSparks();
    const customIdx = custom.findIndex((s) => s.id === spark!.id);
    if (customIdx >= 0) {
      custom[customIdx] = spark!;
      localStorage.setItem(CUSTOM_SPARKS_KEY, JSON.stringify(custom));
      return;
    }

    // Otherwise record in updated map
    const updatedMap = this.getUpdatedSparks();
    updatedMap[spark!.id] = spark!;
    localStorage.setItem(UPDATED_SPARKS_KEY, JSON.stringify(updatedMap));
  }

  public deleteSpark(id: string): void {
    const custom = this.getCustomSparks().filter((s) => s.id !== id);
    localStorage.setItem(CUSTOM_SPARKS_KEY, JSON.stringify(custom));

    const deleted = this.getDeletedSparkIds();
    if (!deleted.includes(id)) {
      deleted.push(id);
      localStorage.setItem(DELETED_SPARKS_KEY, JSON.stringify(deleted));
    }
  }

  public toggleFeatured(id: string): boolean {
    const spark = this.getSparkById(id);
    if (!spark) return false;
    const isNowFeatured = !spark.isFeatured;
    this.updateSpark({ ...spark, isFeatured: isNowFeatured });
    return isNowFeatured;
  }

  public recordSelection(id: string, studentId?: string): void {
    const stats = this.getStats();
    if (!stats[id]) {
      stats[id] = { timesSelected: 0, studentIds: [] };
    }
    stats[id].timesSelected += 1;
    if (studentId && !stats[id].studentIds.includes(studentId)) {
      stats[id].studentIds.push(studentId);
    }
    localStorage.setItem(SPARK_STATS_KEY, JSON.stringify(stats));
  }

  public getFavorites(): string[] {
    try {
      const data = localStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public toggleFavorite(id: string): boolean {
    const favs = this.getFavorites();
    const idx = favs.indexOf(id);
    let isFav = false;
    if (idx >= 0) {
      favs.splice(idx, 1);
      isFav = false;
    } else {
      favs.push(id);
      isFav = true;
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    return isFav;
  }
}

export const storySparksManager = new StorySparksManager();
